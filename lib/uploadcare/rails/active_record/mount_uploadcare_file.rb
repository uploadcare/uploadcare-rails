# frozen_string_literal: true

require 'active_support/concern'

module Uploadcare
  module Rails
    # A module containing ActiveRecord extension. Allows to use uploadcare file methods in Rails models
    module ActiveRecord
      extend ActiveSupport::Concern

      UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.freeze

      def build_uploadcare_file(attribute)
        cdn_url = attributes[attribute.to_s].to_s
        return nil if cdn_url.empty?

        uuid = cdn_url.match(UUID_REGEX).to_s
        ::Rails.cache.read(cdn_url) || Uploadcare::Rails::File.new(cdn_url: cdn_url, uuid: uuid.presence)
      end

      def log_uploadcare_error(exception, message)
        logger.error message
        logger.error ::Rails.backtrace_cleaner.clean(exception.backtrace).join("\n ").to_s
      end

      class_methods do
        # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Lint/NestedMethodDefinition
        def mount_uploadcare_file(attribute, _options = {})
          define_method attribute.to_s do
            build_uploadcare_file attribute
          end

          define_method "store_#{attribute}!" do
            file = build_uploadcare_file attribute
            return unless file

            begin
              file.store
            rescue Uploadcare::Exception::RequestError => e
              log_uploadcare_error(e, "\nError while saving a file #{file.cdn_url}: #{e.class} (#{e.message}):")
            end

            file
          end

          define_method "delete_#{attribute}!" do
            file = build_uploadcare_file attribute
            return unless file

            begin
              file.delete
            rescue Uploadcare::Exception::RequestError => e
              log_uploadcare_error(e, "\nError while deleting a file #{file.cdn_url}: #{e.class} (#{e.message}):")
            end

            file
          end

          def uploadcare_configuration
            @uploadcare_configuration ||= Uploadcare::Rails.configuration
          end

          after_save "store_#{attribute}!".to_sym if uploadcare_configuration.store_files_after_save
          after_destroy "delete_#{attribute}!".to_sym if uploadcare_configuration.delete_files_after_destroy
        end
        # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Lint/NestedMethodDefinition
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord
