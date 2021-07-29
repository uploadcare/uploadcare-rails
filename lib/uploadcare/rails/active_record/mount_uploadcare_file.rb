# frozen_string_literal: true

require 'active_record'
require 'active_support/concern'
require 'uploadcare/errors/mount_error'

module Uploadcare
  module Rails
    module ActiveRecord
      # A module containing ActiveRecord extension. Allows to use uploadcare file methods in Rails models
      module MountUploadcareFile
        extend ActiveSupport::Concern

        FILE_ID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.freeze

        def build_uploadcare_file(attribute)
          cdn_url = attributes[attribute.to_s].to_s
          return nil if cdn_url.empty?

          uuid = cdn_url.match(FILE_ID_REGEX).to_s.presence
          ::Rails.cache.read(cdn_url) || Uploadcare::Rails::File.new(cdn_url: cdn_url, uuid: uuid)
        end

        def log_uploadcare_error(exception, message)
          logger.error message
          logger.error ::Rails.backtrace_cleaner.clean(exception.backtrace).join("\n ").to_s
        end

        class_methods do
          # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Lint/NestedMethodDefinition
          def mount_uploadcare_file(attribute, _options = {})
            validate_file_mount!(attribute)

            define_singleton_method "has_uploadcare_file_for_#{attribute}?" do
              true
            end

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

            after_destroy "delete_#{attribute}!".to_sym if uploadcare_configuration.delete_files_after_destroy
          end
          # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Lint/NestedMethodDefinition

          def validate_file_mount!(attribute)
            method_name = "has_uploadcare_file_group_for_#{attribute}?"
            return unless respond_to?(method_name) && send(method_name)

            raise Uploadcare::Errors::MountError,
                  'Can not mount a file group because this attribute has a file mounted already'
          end
        end
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFile
