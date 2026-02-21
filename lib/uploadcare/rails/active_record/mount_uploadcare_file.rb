# frozen_string_literal: true

require 'active_record'
require 'active_support/concern'
require 'uploadcare/rails/services/id_extractor'
require 'uploadcare/rails/jobs/delete_file_job'
require 'uploadcare/rails/jobs/store_file_job'

module Uploadcare
  module Rails
    # ActiveRecord integration for Uploadcare.
    module ActiveRecord
      # A module containing ActiveRecord extension. Allows to use uploadcare file methods in Rails models
      module MountUploadcareFile
        extend ActiveSupport::Concern

        # Builds Uploadcare file object from model attribute value.
        # @param attribute [Symbol, String]
        # @return [Uploadcare::Rails::File, nil]
        def build_uploadcare_file(attribute)
          cdn_url = attributes[attribute.to_s].to_s
          return if cdn_url.empty?

          uuid = IdExtractor.call(cdn_url)
          cache_key = File.build_cache_key(cdn_url)
          default_attributes = { cdn_url: cdn_url, uuid: uuid.presence }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::File.new(file_attributes)
        end

        class_methods do
          # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
          def mount_uploadcare_file(attribute, uploadcare_config: nil)
            use_custom_config = !uploadcare_config.nil?

            define_method attribute do
              build_uploadcare_file(attribute).tap do |file|
                next unless file

                file.config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              end
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreFileJob|
              file_uuid = public_send(attribute)&.uuid
              return unless file_uuid

              config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              if Uploadcare::Rails.configuration.store_files_async
                if use_custom_config
                  config_options = Uploadcare::Rails.serialize_client_config(config)
                  return store_job.perform_later(file_uuid, config_options)
                end
                return store_job.perform_later(file_uuid)
              end

              return Uploadcare::FileApi.store_file(file_uuid, config: config) if use_custom_config

              Uploadcare::FileApi.store_file(file_uuid)
            end

            define_method "uploadcare_delete_#{attribute}!" do |delete_job = DeleteFileJob|
              file_uuid = public_send(attribute)&.uuid
              return unless file_uuid

              config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              if Uploadcare::Rails.configuration.delete_files_async
                if use_custom_config
                  config_options = Uploadcare::Rails.serialize_client_config(config)
                  return delete_job.perform_later(file_uuid, config_options)
                end
                return delete_job.perform_later(file_uuid)
              end

              return Uploadcare::FileApi.delete_file(file_uuid, config: config) if use_custom_config

              Uploadcare::FileApi.delete_file(file_uuid)
            end

            unless Uploadcare::Rails.configuration.do_not_store
              after_save :"uploadcare_store_#{attribute}!", if: :"will_save_change_to_#{attribute}?"
            end

            return unless Uploadcare::Rails.configuration.delete_files_after_destroy

            after_destroy :"uploadcare_delete_#{attribute}!"
          end
          # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
        end

        private

        def resolve_uploadcare_config(config_source)
          return Uploadcare.configuration if config_source.nil?
          return instance_exec(&config_source) if config_source.respond_to?(:call)

          config_source
        end
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFile
