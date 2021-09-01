# frozen_string_literal: true

require 'active_support/concern'
require 'uploadcare/rails/jobs/uploadcare_delete_file_job'
require 'uploadcare/rails/jobs/uploadcare_store_file_job'

module Uploadcare
  module Rails
    # A module containing ActiveRecord extension. Allows to use uploadcare file methods in Rails models
    module ActiveRecord
      extend ActiveSupport::Concern

      UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.freeze

      def build_uploadcare_file(attribute)
        cdn_url = attributes[attribute.to_s].to_s
        return if cdn_url.empty?

        uuid = cdn_url.match(UUID_REGEX).to_s
        cache_key = File.cache_key(cdn_url)
        ::Rails.cache.fetch(cache_key) do
          Uploadcare::Rails::File.new(cdn_url: cdn_url, uuid: uuid.presence)
        end
      end

      class_methods do
        def log_uploadcare_error(exception, message)
          logger.error message
          logger.error ::Rails.backtrace_cleaner.clean(exception.backtrace).join("\n ").to_s
        end

        def uploadcare_perform_file_deleting(file_uuid)
          Uploadcare::FileApi.delete_file(file_uuid) if file_uuid
        rescue Uploadcare::Exception::RequestError => e
          log_uploadcare_error(e, "\nError while deleting a file #{file_uuid}: #{e.class} (#{e.message}):")
        end

        def uploadcare_perform_file_storing(file_uuid)
          Uploadcare::FileApi.store_file(file_uuid) if file_uuid
        rescue Uploadcare::Exception::RequestError => e
          log_uploadcare_error(e, "\nError while saving a file #{file_uuid}: #{e.class} (#{e.message}):")
        end

        # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
        def mount_uploadcare_file(attribute)
          define_method attribute do
            build_uploadcare_file attribute
          end

          define_method "uploadcare_store_#{attribute}!" do |store_job = UploadcareStoreFileJob|
            file_uuid = send(attribute)&.uuid
            if Uploadcare::Rails.configuration.store_files_async
              return store_job.perform_later(self.class.name, file_uuid)
            end

            self.class.uploadcare_perform_file_storing(file_uuid)
          end

          define_method "uploadcare_delete_#{attribute}!" do |delete_job = UploadcareDeleteFileJob|
            file_uuid = send(attribute)&.uuid
            if Uploadcare::Rails.configuration.delete_files_async
              return delete_job.perform_later(self.class.name, file_uuid)
            end

            self.class.uploadcare_perform_file_deleting(file_uuid)
          end

          after_save "uploadcare_store_#{attribute}!".to_sym unless Uploadcare::Rails.configuration.do_not_store
          return unless Uploadcare::Rails.configuration.delete_files_after_destroy

          after_destroy "uploadcare_delete_#{attribute}!".to_sym
        end
        # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord
