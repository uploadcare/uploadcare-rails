# frozen_string_literal: true

require 'uploadcare'
require 'uploadcare/rails/api/rest/file_api'
require 'uploadcare/rails/transformations/image_transformations'
require 'active_record'

module Uploadcare
  module Rails
    # A wrapper class that for Uploadcare::File object.
    # Allows caching loaded files and has methods for Rails model attributes
    class File < Uploadcare::Entity::File
      include ActiveRecord::AttributeAssignment

      ATTR_ENTITIES = [:cdn_url].freeze

      attr_entity(*superclass.entity_attributes + ATTR_ENTITIES)

      class << self
        def cache_key(cdn_url)
          [uploadcare_configuration.cache_namespace, cdn_url].flatten.reject(&:blank?)
        end

        def uploadcare_configuration
          Uploadcare::Rails.configuration
        end
      end

      def transform_url(transformations, transformator_class = Uploadcare::Rails::Transformations::ImageTransformations)
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        [cdn_url, transformations_query].select(&:present?).join('-')
      end

      def store
        file_info = Uploadcare::FileApi.store_file(uuid).merge(cdn_url: cdn_url).to_h
        ::Rails.cache.write(cache_key, file_info, expires_in: cache_expires_in) if caching_enabled?
        update_attrs(file_info)
      end

      def delete
        Uploadcare::FileApi.delete_file(uuid)
      end

      def to_s
        cdn_url
      end

      def load
        file_info = if caching_enabled?
                      ::Rails.cache.fetch(cache_key, expires_in: cache_expires_in) do
                        request_file_info_from_api
                      end
                    else
                      request_file_info_from_api
                    end
        update_attrs(file_info)
      end

      def loaded?
        datetime_uploaded.present?
      end

      private

      def request_file_info_from_api
        Uploadcare::FileApi.get_file(uuid).merge(self).to_h
      end

      def update_attrs(new_attr)
        assign_attributes(new_attr)
        self
      end

      def cache_expires_in
        uploadcare_configuration.cache_expires_in
      end

      def caching_enabled?
        uploadcare_configuration.cache_files
      end

      def uploadcare_configuration
        self.class.uploadcare_configuration
      end

      def cache_key
        self.class.cache_key(cdn_url)
      end
    end
  end
end
