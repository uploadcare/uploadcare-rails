# frozen_string_literal: true

require "active_support/concern"

module Uploadcare
  module Rails
    module Internal
      module ModelMacros
        extend ActiveSupport::Concern

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
            define_method attribute do
              client = resolve_uploadcare_client(uploadcare_client)
              build_uploadcare_file(attribute, client: client)
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreFileJob|
              file = public_send(attribute)
              return unless file&.uuid

              client = resolve_uploadcare_client(uploadcare_client)
              if Uploadcare::Rails.configuration.store_files_async
                client_options = client ? Uploadcare::Rails.serialize_client_options(client) : {}
                return store_job.perform_later(file.uuid, client_options)
              end

              (client || Uploadcare::Rails.client).files.batch_store(uuids: [ file.uuid ])
            end

            define_method "uploadcare_delete_#{attribute}!" do |delete_job = DeleteFileJob|
              file = public_send(attribute)
              return unless file&.uuid

              client = resolve_uploadcare_client(uploadcare_client)
              if Uploadcare::Rails.configuration.delete_files_async
                client_options = client ? Uploadcare::Rails.serialize_client_options(client) : {}
                return delete_job.perform_later(file.uuid, client_options)
              end

              (client || Uploadcare::Rails.client).files.batch_delete(uuids: [ file.uuid ])
            end

            register_uploadcare_file_callbacks(attribute)
          end

          def has_uploadcare_files(attribute, uploadcare_client: nil)
            define_singleton_method "has_uploadcare_files_for_#{attribute}?" do
              true
            end

            define_method attribute do
              client = resolve_uploadcare_client(uploadcare_client)
              build_uploadcare_file_group(attribute, client: client)
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreGroupJob|
              group = public_send(attribute)
              return unless group&.id

              client = resolve_uploadcare_client(uploadcare_client)
              if Uploadcare::Rails.configuration.store_files_async
                client_options = client ? Uploadcare::Rails.serialize_client_options(client) : {}
                return store_job.perform_later(group.id, client_options)
              end

              resolved = client || Uploadcare::Rails.client
              group_resource = resolved.groups.find(group_id: group.id)
              file_uuids = Array(group_resource.files).filter_map { |f| f["uuid"] || f[:uuid] }
              resolved.files.batch_store(uuids: file_uuids) if file_uuids.any?
            end

            register_uploadcare_group_callbacks(attribute)
          end
        end

        private

        def resolve_uploadcare_client(client_source)
          return nil if client_source.nil?
          return instance_exec(&client_source) if client_source.respond_to?(:call)

          client_source
        end
      end
    end
  end
end
