# frozen_string_literal: true

require 'mongoid'
require 'active_support/concern'
require 'uploadcare/rails/services/id_extractor'
require 'uploadcare/rails/services/files_count_extractor'
require 'uploadcare/rails/jobs/store_group_job'
require 'uploadcare/rails/objects/group'

module Uploadcare
  module Rails
    module Mongoid
      # A module containing Mongoid extension. Allows to use uploadcare group methods in Rails models
      module MountUploadcareFileGroup
        extend ActiveSupport::Concern

        # Regexp for extracting Uploadcare group id from URL.
        GROUP_ID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b~\d+/.freeze

        # Builds Uploadcare group object from model attribute value.
        # @param attribute [Symbol, String]
        # @return [Uploadcare::Rails::Group, nil]
        def build_uploadcare_file_group(attribute)
          cdn_url = read_attribute(attribute).to_s
          return if cdn_url.empty?

          group_id = IdExtractor.call(cdn_url, GROUP_ID_REGEX).presence
          cache_key = Group.build_cache_key(cdn_url)
          files_count = FilesCountExtractor.call(group_id)
          default_attributes = { cdn_url: cdn_url, id: group_id, files_count: files_count }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::Group.new(file_attributes)
        end

        # Class-level API for mounting Uploadcare file groups.
        module ClassMethods
          # Mounts Uploadcare group behavior on an attribute.
          # @param attribute [Symbol, String]
          # @param uploadcare_config [Uploadcare::Configuration, Proc, nil]
          # @return [void]
          def mount_uploadcare_file_group(attribute, uploadcare_config: nil)
            use_custom_config = !uploadcare_config.nil?

            define_uploadcare_group_predicate(attribute)
            define_uploadcare_group_reader(attribute, uploadcare_config, use_custom_config)
            define_uploadcare_group_store_method(attribute, uploadcare_config, use_custom_config)
            register_uploadcare_group_callback(attribute)
          end

          private

          def define_uploadcare_group_predicate(attribute)
            define_singleton_method "has_uploadcare_file_group_for_#{attribute}?" do
              true
            end
          end

          def define_uploadcare_group_reader(attribute, uploadcare_config, use_custom_config)
            define_method attribute do
              build_uploadcare_file_group(attribute).tap do |group|
                next unless group

                group.config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              end
            end
          end

          def define_uploadcare_group_store_method(attribute, uploadcare_config, use_custom_config)
            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreGroupJob|
              group_id = public_send(attribute)&.id
              return unless group_id

              config = resolve_uploadcare_config(uploadcare_config) if use_custom_config
              store_uploadcare_group(group_id, store_job, config, use_custom_config)
            end
          end

          def register_uploadcare_group_callback(attribute)
            return if Uploadcare::Rails.configuration.do_not_store

            set_callback :save, :after, :"uploadcare_store_#{attribute}!"
          end
        end

        private

        def store_uploadcare_group(group_id, store_job, config, use_custom_config)
          if Uploadcare::Rails.configuration.store_files_async
            return store_uploadcare_group_async(group_id, store_job, config, use_custom_config)
          end

          return Uploadcare::GroupApi.store_group(group_id, config: config) if use_custom_config

          Uploadcare::GroupApi.store_group(group_id)
        end

        def store_uploadcare_group_async(group_id, store_job, config, use_custom_config)
          return store_job.perform_later(group_id) unless use_custom_config

          config_options = Uploadcare::Rails.serialize_client_config(config)
          store_job.perform_later(group_id, config_options)
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

Mongoid::Document.include Uploadcare::Rails::Mongoid::MountUploadcareFileGroup
