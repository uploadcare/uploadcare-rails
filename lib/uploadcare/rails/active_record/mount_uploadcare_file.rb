# frozen_string_literal: true

require "active_record"
require "active_support/concern"
require "uploadcare/rails/services/id_extractor"
require "uploadcare/rails/jobs/delete_file_job"
require "uploadcare/rails/jobs/store_file_job"

module Uploadcare
  module Rails
    module ActiveRecord
      module MountUploadcareFile
        extend ActiveSupport::Concern

        def build_uploadcare_file(attribute, client: nil)
          cdn_url = attributes[attribute.to_s].to_s
          return if cdn_url.empty?

          uuid = IdExtractor.call(cdn_url)
          cache_key = File.build_cache_key(cdn_url)
          default_attributes = { cdn_url: cdn_url, uuid: uuid.presence }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::File.new(file_attributes, client: client)
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

              (client || Uploadcare::Rails.client).files.batch_store(uuids: [file.uuid])
            end

            define_method "uploadcare_delete_#{attribute}!" do |delete_job = DeleteFileJob|
              file = public_send(attribute)
              return unless file&.uuid

              client = resolve_uploadcare_client(uploadcare_client)
              if Uploadcare::Rails.configuration.delete_files_async
                client_options = client ? Uploadcare::Rails.serialize_client_options(client) : {}
                return delete_job.perform_later(file.uuid, client_options)
              end

              (client || Uploadcare::Rails.client).files.batch_delete(uuids: [file.uuid])
            end

            if Uploadcare::Rails.configuration.store_files_after_save
              after_save :"uploadcare_store_#{attribute}!", if: :"will_save_change_to_#{attribute}?"
            end

            if Uploadcare::Rails.configuration.delete_files_after_destroy
              after_destroy :"uploadcare_delete_#{attribute}!"
            end
          end

          alias_method :mount_uploadcare_file, :has_uploadcare_file
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

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFile
