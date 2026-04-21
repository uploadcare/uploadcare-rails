# frozen_string_literal: true

require "active_support/concern"
require "uploadcare/rails/internal/file_uuid_extraction"

module Uploadcare
  module Rails
    module Internal
      module ModelMacros
        extend ActiveSupport::Concern
        include FileUuidExtraction

        GROUP_ID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b~\d+/.freeze

        def build_uploadcare_file(attribute, client: nil)
          cdn_url = read_uploadcare_attribute(attribute).to_s
          return if cdn_url.empty?

          uuid = IdExtractor.call(cdn_url)
          cache_key = AttachedFile.build_cache_key(cdn_url)
          default_attributes = { cdn_url: cdn_url, uuid: uuid.presence }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          AttachedFile.new(file_attributes, client: client)
        end

        def build_uploadcare_file_group(attribute, client: nil)
          cdn_url = read_uploadcare_attribute(attribute).to_s
          return if cdn_url.empty?

          group_id = IdExtractor.call(cdn_url, GROUP_ID_REGEX).presence
          cache_key = AttachedFiles.build_cache_key(cdn_url)
          files_count = FilesCountExtractor.call(group_id)
          default_attributes = { cdn_url: cdn_url, id: group_id, files_count: files_count }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          AttachedFiles.new(file_attributes, client: client)
        end

        class_methods do
          def has_uploadcare_file(attribute, uploadcare_client: nil)
            validate_async_uploadcare_client_configuration!(
              uploadcare_client: uploadcare_client,
              stores: true,
              deletes: true
            )

            define_method attribute do
              client = resolve_uploadcare_client(uploadcare_client)
              build_uploadcare_file(attribute, client: client)
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreFileJob|
              file = public_send(attribute)
              return unless file&.uuid

              client = resolve_uploadcare_client(uploadcare_client)
              if Uploadcare::Rails.configuration.store_files_async
                ensure_async_default_client!(client)
                return store_job.perform_later(file.uuid)
              end

              (client || Uploadcare::Rails.client).files.batch_store(uuids: [ file.uuid ])
            end

            define_method "uploadcare_delete_#{attribute}!" do |delete_job = DeleteFileJob|
              file = public_send(attribute)
              return unless file&.uuid

              client = resolve_uploadcare_client(uploadcare_client)
              if Uploadcare::Rails.configuration.delete_files_async
                ensure_async_default_client!(client)
                return delete_job.perform_later(file.uuid)
              end

              (client || Uploadcare::Rails.client).files.batch_delete(uuids: [ file.uuid ])
            end

            register_uploadcare_file_callbacks(attribute)
          end

          def has_uploadcare_files(attribute, uploadcare_client: nil)
            validate_async_uploadcare_client_configuration!(
              uploadcare_client: uploadcare_client,
              stores: true,
              deletes: false
            )

            define_singleton_method "has_uploadcare_files_for_#{attribute}?" do
              true
            end

            define_method attribute do
              client = resolve_uploadcare_client(uploadcare_client)
              build_uploadcare_file_group(attribute, client: client)
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreGroupJob|
              client = resolve_uploadcare_client(uploadcare_client)
              group = build_uploadcare_file_group(attribute, client: client)
              return unless group&.id

              if Uploadcare::Rails.configuration.store_files_async
                ensure_async_default_client!(client)
                return store_job.perform_later(group.id)
              end

              group.store
            end

            register_uploadcare_group_callbacks(attribute)
          end

          private

          def validate_async_uploadcare_client_configuration!(uploadcare_client:, stores:, deletes:)
            return if uploadcare_client.nil?

            async_store_enabled = stores && Uploadcare::Rails.configuration.store_files_async
            async_delete_enabled = deletes && Uploadcare::Rails.configuration.delete_files_async
            return unless async_store_enabled || async_delete_enabled

            raise ArgumentError, "Async Uploadcare callbacks do not support custom uploadcare_client values"
          end
        end

        private

        def resolve_uploadcare_client(client_source)
          resolved = client_source.respond_to?(:call) ? instance_exec(&client_source) : client_source
          return nil if resolved.nil?

          Uploadcare::Rails.resolve_client(resolved)
        end

        def ensure_async_default_client!(client)
          return if client.nil? || client_uses_default_credentials?(client)

          raise ArgumentError, "Async Uploadcare callbacks do not support custom uploadcare_client values"
        end

        def client_uses_default_credentials?(client)
          normalized_client_config(client.config) == normalized_client_config(Uploadcare.configuration)
        end

        def normalized_client_config(config)
          config.to_h.except(:logger, :framework_data)
        end
      end
    end
  end
end
