# frozen_string_literal: true

require 'active_record'
require 'active_support/concern'
require 'uploadcare/errors/mount_error'

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

          uuid = cdn_url.match(GROUP_ID_REGEX).to_s.presence
          files_count = uuid.split('~').last
          ::Rails.cache.read(cdn_url) ||
            Uploadcare::Rails::Group.new(cdn_url: cdn_url, id: uuid, files_count: files_count)
        end

        class_methods do
          # rubocop:disable Metrics/MethodLength, Lint/NestedMethodDefinition
          def mount_uploadcare_file_group(attribute)
            validate_group_mount!(attribute)

            define_singleton_method "has_uploadcare_file_group_for_#{attribute}?" do
              true
            end

            define_method attribute.to_s do
              build_uploadcare_file_group attribute
            end

            define_method "store_#{attribute}!" do
              group = build_uploadcare_file_group attribute
              return unless group

              begin
                group.store
              rescue Uploadcare::Exception::RequestError => e
                log_uploadcare_error(e, "\nError while saving a group #{group.cdn_url}: #{e.class} (#{e.message}):")
              end

              group
            end

            def uploadcare_configuration
              @uploadcare_configuration ||= Uploadcare::Rails.configuration
            end
          end
          # rubocop:enable Metrics/MethodLength, Lint/NestedMethodDefinition

          def validate_group_mount!(attribute)
            method_name = "has_uploadcare_file_for_#{attribute}?"

            return unless respond_to?(method_name) && send(method_name)

            raise Uploadcare::Errors::MountError,
                  'Can not mount a file group because this attribute has a file mounted already'
          end
        end
      end
    end
  end
end

ActiveRecord::Base.include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup
