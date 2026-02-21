# frozen_string_literal: true

require 'uploadcare/rails/api/rest/file_api'
require 'uploadcare/rails/transformations/image_transformations'
require 'uploadcare/rails/objects/concerns/loadable'

module Uploadcare
  module Rails
    # Uploadcare file wrapper with Rails-specific helpers.
    class File < Uploadcare::File
      include Objects::Loadable
      attr_writer :cdn_url

      # Builds transformed URL for file.
      # @param transformations [Hash]
      # @param transformator_class [Class]
      # @return [String, nil]
      def transform_url(transformations, transformator_class = Uploadcare::Rails::Transformations::ImageTransformations)
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        [cdn_url, transformations_query].compact.join('-')
      end

      # Stores file on Uploadcare and refreshes cached attributes.
      # @return [self]
      def store
        file_info = attributes_from_file(Uploadcare::FileApi.store_file(uuid, config: config))
        ::Rails.cache.write(cache_key, file_info, expires_in: cache_expires_in) if caching_enabled?
        update_attrs(file_info)
      end

      # Deletes file from Uploadcare.
      # @return [Object]
      def delete
        Uploadcare::FileApi.delete_file(uuid, config: config)
      end

      # String representation as CDN URL.
      # @return [String]
      def to_s
        cdn_url
      end

      def cdn_url
        @cdn_url.presence || super
      end

      # Loads file metadata from API or cache.
      # @return [self]
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
        attributes_from_file(Uploadcare::FileApi.get_file(uuid, config: config))
      end

      def attributes_from_file(file)
        file.class::ATTRIBUTES.each_with_object({}) do |attribute, result|
          result[attribute.to_s] = file.public_send(attribute)
        end
      end
    end
  end
end
