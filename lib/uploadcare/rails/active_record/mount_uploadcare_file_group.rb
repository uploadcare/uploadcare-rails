# frozen_string_literal: true

require 'active_record'
require 'active_support/concern'
require 'uploadcare/rails/services/id_extractor'
require 'uploadcare/rails/services/files_count_extractor'
require 'uploadcare/rails/jobs/store_group_job'

module Uploadcare
  module Rails
    module ActiveRecord
      # A module containing ActiveRecord extension. Allows to use uploadcare group methods in Rails models
      module MountUploadcareFileGroup
        extend ActiveSupport::Concern

        GROUP_ID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b~\d+/.freeze

        def build_uploadcare_file_group(attribute)
          cdn_url = attributes[attribute.to_s].to_s
          return if cdn_url.empty?

          group_id = IdExtractor.call(cdn_url, GROUP_ID_REGEX).presence
          cache_key = File.build_cache_key(cdn_url)
          files_count = FilesCountExtractor.call(group_id)
          default_attributes = { cdn_url: cdn_url, id: group_id, files_count: files_count }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::Group.new(file_attributes)
        end

        class_methods do
          # rubocop:disable Metrics/MethodLength
          def mount_uploadcare_file_group(attribute, uploadcare_config: nil)
            use_custom_config = !uploadcare_config.nil?

            define_singleton_method "has_uploadcare_file_group_for_#{attribute}?" do
              true
            end

            define_method attribute do
              build_uploadcare_file_group(attribute).tap do |group|
                next unless group

                group.config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              end
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreGroupJob|
              group_id = public_send(attribute)&.id
              return unless group_id
              config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              if Uploadcare::Rails.configuration.store_files_async
                if use_custom_config
                  config_options = Uploadcare::Rails.serialize_client_config(config)
                  return store_job.perform_later(group_id, config_options)
                end
                return store_job.perform_later(group_id)
              end

              return Uploadcare::GroupApi.store_group(group_id, config: config) if use_custom_config

              Uploadcare::GroupApi.store_group(group_id)
            end

            after_save :"uploadcare_store_#{attribute}!" unless Uploadcare::Rails.configuration.do_not_store
          end
          # rubocop:enable Metrics/MethodLength
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

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup
