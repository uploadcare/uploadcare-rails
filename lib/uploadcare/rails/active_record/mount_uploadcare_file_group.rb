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

        GROUP_ID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b~\d/.freeze

        def build_uploadcare_file_group(attribute)
          cdn_url = attributes[attribute.to_s].to_s
          return nil if cdn_url.empty?

          group_id = IdExtractor.call(cdn_url, GROUP_ID_REGEX).presence
          cache_key = File.build_cache_key(cdn_url)
          files_count = FilesCountExtractor.call(group_id)
          default_attributes = { cdn_url: cdn_url, id: group_id, files_count: files_count }
          file_attributes = ::Rails.cache.read(cache_key).presence || default_attributes
          Uploadcare::Rails::Group.new(file_attributes)
        end

        class_methods do
          # rubocop:disable Metrics/MethodLength
          def mount_uploadcare_file_group(attribute)
            define_singleton_method "has_uploadcare_file_group_for_#{attribute}?" do
              true
            end

            define_method attribute do
              build_uploadcare_file_group attribute
            end

            define_method "uploadcare_store_#{attribute}!" do |store_job = StoreGroupJob|
              group_id = public_send(attribute)&.id
              return store_job.perform_later(group_id) if Uploadcare::Rails.configuration.store_files_async

              Uploadcare::GroupApi.store_group(group_id) if group_id
            end

            after_save "uploadcare_store_#{attribute}!".to_sym unless Uploadcare::Rails.configuration.do_not_store
          end
          # rubocop:enable Metrics/MethodLength
        end
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup
