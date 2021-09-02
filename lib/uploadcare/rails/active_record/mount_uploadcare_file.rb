# frozen_string_literal: true

require 'active_support/concern'
require 'uploadcare/rails/services/id_extractor'
require 'uploadcare/rails/jobs/uploadcare_delete_file_job'
require 'uploadcare/rails/jobs/uploadcare_store_file_job'

module Uploadcare
  module Rails
    # A module containing ActiveRecord extension. Allows to use uploadcare file methods in Rails models
    module ActiveRecord
      extend ActiveSupport::Concern

      def build_uploadcare_file(attribute)
        cdn_url = attributes[attribute.to_s].to_s
        return if cdn_url.empty?

        uuid = IdExtractor.call(cdn_url)
        cache_key = File.cache_key(cdn_url)
        ::Rails.cache.fetch(cache_key) do
          Uploadcare::Rails::File.new(cdn_url: cdn_url, uuid: uuid.presence)
        end
      end

      class_methods do
        # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
        def mount_uploadcare_file(attribute)
          define_method attribute do
            build_uploadcare_file attribute
          end

          define_method "uploadcare_store_#{attribute}!" do |store_job = UploadcareStoreFileJob|
            file_uuid = send(attribute)&.uuid
            if Uploadcare::Rails.configuration.store_files_async
              return store_job.perform_later(self.class.name, file_uuid)
            end

            Uploadcare::FileApi.store_file(file_uuid) if file_uuid
          end

          define_method "uploadcare_delete_#{attribute}!" do |delete_job = UploadcareDeleteFileJob|
            file_uuid = send(attribute)&.uuid
            if Uploadcare::Rails.configuration.delete_files_async
              return delete_job.perform_later(self.class.name, file_uuid)
            end

            Uploadcare::FileApi.delete_file(file_uuid) if file_uuid
          end

          after_save "uploadcare_store_#{attribute}!".to_sym unless Uploadcare::Rails.configuration.do_not_store
          return unless Uploadcare::Rails.configuration.delete_files_after_destroy

          after_destroy "uploadcare_delete_#{attribute}!".to_sym
        end
        # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord
