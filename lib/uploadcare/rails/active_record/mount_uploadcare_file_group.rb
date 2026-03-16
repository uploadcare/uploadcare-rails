# frozen_string_literal: true

require "active_record"
require "active_support/concern"
require "uploadcare/rails/services/id_extractor"
require "uploadcare/rails/services/files_count_extractor"
require "uploadcare/rails/jobs/store_group_job"

module Uploadcare
  module Rails
    module ActiveRecord
      module MountUploadcareFileGroup
        extend ActiveSupport::Concern

        GROUP_ID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b~\d+/.freeze

        def build_uploadcare_file_group(attribute, client: nil)
          cdn_url = attributes[attribute.to_s].to_s
          return if cdn_url.empty?

          group_id = IdExtractor.call(cdn_url, GROUP_ID_REGEX).presence
          cache_key = File.build_cache_key(cdn_url)
          files_count = FilesCountExtractor.call(group_id)
          default_attributes = { cdn_url: cdn_url, id: group_id, files_count: files_count }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::Group.new(file_attributes, client: client)
        end

        class_methods do
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

              (client || Uploadcare::Rails.client).groups.find(group_id: group.id)
            end

            if Uploadcare::Rails.configuration.store_files_after_save
              after_save :"uploadcare_store_#{attribute}!"
            end
          end

          alias_method :mount_uploadcare_file_group, :has_uploadcare_files
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

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup
