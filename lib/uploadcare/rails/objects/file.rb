# frozen_string_literal: true

require 'uploadcare'
require 'uploadcare/rails/api/rest/file_api'
require 'uploadcare/rails/transformations/image_transformations'

module Uploadcare
  module Rails
    # A wrapper class that for Uploadcare::File object.
    # Allows caching loaded files and has methods for Rails model attributes
    class File < Uploadcare::Entity::File
      ATTR_ENTITIES = [:cdn_url].freeze

      attr_entity(*superclass.entity_attributes + ATTR_ENTITIES)

      def transform_url(transformations, transformator_class = Uploadcare::Rails::Transformations::ImageTransformations)
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        [cdn_url, transformations_query].select(&:present?).join('-')
      end

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
