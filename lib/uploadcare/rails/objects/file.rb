# frozen_string_literal: true

require 'uploadcare'
require 'uploadcare/rails/api/rest/file_api'

module Uploadcare
  module Rails
    # A wrapper class that for Uploadcare::File object.
    # Allows caching loaded files and has methods for Rails model attributes
    class File < Uploadcare::Entity::File
      ATTR_ENTITIES = [:cdn_url].freeze

      attr_entity(*superclass.entity_attributes.concat(ATTR_ENTITIES))

      def store
        file_info = Uploadcare::FileApi.store_file(uuid).merge(cdn_url: cdn_url)
        ::Rails.cache.write(cdn_url, file_info) if uploadcare_configuration.cache_files
        file_info
      end

      def delete
        Uploadcare::FileApi.delete_file(uuid)
      end

      def to_s
        cdn_url
      end

      def load
        file_info = super().merge(cdn_url: cdn_url)
        ::Rails.cache.write(cdn_url, file_info) if uploadcare_configuration.cache_files
        merge(file_info)
      end

      def loaded?
        datetime_uploaded.present?
      end

      private

      def uploadcare_configuration
        Uploadcare::Rails.configuration
      end
    end
  end
end
