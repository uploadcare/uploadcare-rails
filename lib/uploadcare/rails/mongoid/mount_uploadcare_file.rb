# frozen_string_literal: true

require "mongoid"
require "active_support/concern"
require "uploadcare/rails/services/id_extractor"
require "uploadcare/rails/jobs/delete_file_job"
require "uploadcare/rails/jobs/store_file_job"
require "uploadcare/rails/objects/file"

module Uploadcare
  module Rails
    # Mongoid integration for Uploadcare.
    module Mongoid
      # A module containing Mongoid extension. Allows using uploadcare file methods in Mongoid models
      module MountUploadcareFile
        extend ActiveSupport::Concern

        # Builds Uploadcare file object from model attribute value.
        # @param attribute [Symbol, String]
        # @return [Uploadcare::Rails::File, nil]
        def build_uploadcare_file(attribute)
          cdn_url = read_attribute(attribute).to_s
          return if cdn_url.empty?

          uuid = IdExtractor.call(cdn_url)
          cache_key = File.build_cache_key(cdn_url)
          default_attributes = { cdn_url: cdn_url, uuid: uuid.presence }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::File.new(file_attributes)
        end

        # Class-level API for mounting Uploadcare files.
        module ClassMethods
          # Mounts Uploadcare file behavior on an attribute.
          # @param attribute [Symbol, String]
          # @param uploadcare_config [Uploadcare::Configuration, Proc, nil]
          # @return [void]
          def mount_uploadcare_file(attribute, uploadcare_config: nil)
            use_custom_config = !uploadcare_config.nil?

            define_uploadcare_file_reader(attribute, uploadcare_config, use_custom_config)
            define_uploadcare_file_store_method(attribute, uploadcare_config, use_custom_config)
            define_uploadcare_file_delete_method(attribute, uploadcare_config, use_custom_config)
            register_uploadcare_file_callbacks(attribute)
          end

          private

          def define_uploadcare_file_reader(attribute, uploadcare_config, use_custom_config)
            define_method attribute do
              build_uploadcare_file(attribute).tap do |file|
                next unless file

                file.config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              end
            end
          end

          def define_uploadcare_file_store_method(attribute, uploadcare_config, use_custom_config)
            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreFileJob|
              file_uuid = public_send(attribute)&.uuid
              return unless file_uuid

              config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              store_uploadcare_file(file_uuid, store_job, config, use_custom_config)
            end
          end

          def define_uploadcare_file_delete_method(attribute, uploadcare_config, use_custom_config)
            define_method "uploadcare_delete_#{attribute}!" do |delete_job = DeleteFileJob|
              file_uuid = public_send(attribute)&.uuid
              return unless file_uuid

              config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              delete_uploadcare_file(file_uuid, delete_job, config, use_custom_config)
            end
          end

          def register_uploadcare_file_callbacks(attribute)
            unless Uploadcare::Rails.configuration.do_not_store
              set_callback(:save, :after, :"uploadcare_store_#{attribute}!", if: :"#{attribute}_changed?")
            end
            return unless Uploadcare::Rails.configuration.delete_files_after_destroy

            set_callback(:destroy, :after, :"uploadcare_delete_#{attribute}!")
          end
        end

        private

        def store_uploadcare_file(file_uuid, store_job, config, use_custom_config)
          if Uploadcare::Rails.configuration.store_files_async
            return store_uploadcare_file_async(file_uuid, store_job, config, use_custom_config)
          end

          return Uploadcare::FileApi.store_file(file_uuid, config: config) if use_custom_config

          Uploadcare::FileApi.store_file(file_uuid)
        end

        def store_uploadcare_file_async(file_uuid, store_job, config, use_custom_config)
          return store_job.perform_later(file_uuid) unless use_custom_config

          config_options = Uploadcare::Rails.serialize_client_config(config)
          store_job.perform_later(file_uuid, config_options)
        end

        def delete_uploadcare_file(file_uuid, delete_job, config, use_custom_config)
          if Uploadcare::Rails.configuration.delete_files_async
            return delete_uploadcare_file_async(file_uuid, delete_job, config, use_custom_config)
          end

          return Uploadcare::FileApi.delete_file(file_uuid, config: config) if use_custom_config

          Uploadcare::FileApi.delete_file(file_uuid)
        end

        def delete_uploadcare_file_async(file_uuid, delete_job, config, use_custom_config)
          return delete_job.perform_later(file_uuid) unless use_custom_config

          config_options = Uploadcare::Rails.serialize_client_config(config)
          delete_job.perform_later(file_uuid, config_options)
        end

        def resolve_uploadcare_config(config_source)
          return Uploadcare.configuration if config_source.nil?
          return instance_exec(&config_source) if config_source.respond_to?(:call)

          config_source
        end
      end
    end
  end
end

Mongoid::Document.include Uploadcare::Rails::Mongoid::MountUploadcareFile
