# frozen_string_literal: true

require 'active_support/concern'
require 'uploadcare/rails/services/id_extractor'
require 'uploadcare/rails/jobs/delete_file_job'
require 'uploadcare/rails/jobs/store_file_job'

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
        default_attributes = { cdn_url: cdn_url, uuid: uuid.presence }
        file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
        Uploadcare::Rails::File.new(file_attributes)
      end

      class_methods do
        # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
        def mount_uploadcare_file(attribute)
          define_method attribute do
            build_uploadcare_file attribute
          end

          define_method "uploadcare_store_#{attribute}!" do |store_job = StoreFileJob|
            file_uuid = send(attribute)&.uuid
            return store_job.perform_later(file_uuid) if Uploadcare::Rails.configuration.store_files_async

            Uploadcare::FileApi.store_file(file_uuid) if file_uuid
          end

          define_method "uploadcare_delete_#{attribute}!" do |delete_job = DeleteFileJob|
            file_uuid = send(attribute)&.uuid
            return delete_job.perform_later(file_uuid) if Uploadcare::Rails.configuration.delete_files_async

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
