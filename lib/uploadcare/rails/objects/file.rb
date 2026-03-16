# frozen_string_literal: true

require "uploadcare/rails/transformations/image_transformations"
require "uploadcare/rails/objects/concerns/loadable"

module Uploadcare
  module Rails
    class File
      include Objects::Loadable

      ATTRIBUTES = %i[
        uuid cdn_url datetime_uploaded datetime_stored datetime_removed
        is_image is_ready mime_type original_file_url original_filename
        size url variations content_info metadata appdata source
      ].freeze

      attr_accessor(*ATTRIBUTES)
      attr_writer :client

      def initialize(attributes = {}, client: nil)
        @client = client
        attributes = attributes.transform_keys(&:to_s)
        ATTRIBUTES.each do |attr|
          key = attr.to_s
          instance_variable_set("@#{attr}", attributes[key]) if attributes.key?(key)
        end
      end

      def transform_url(transformations, transformator_class = Transformations::ImageTransformations)
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        [cdn_url, transformations_query].compact.join("-")
      end

      def store
        resource = resolve_client.files.find(uuid: uuid)
        resource.store
        file_info = resource_to_hash(resource).merge("cdn_url" => cdn_url)
        ::Rails.cache.write(cache_key, file_info, expires_in: cache_expires_in) if caching_enabled?
        update_attrs(file_info)
      end

      def delete
        resolve_client.files.batch_delete(uuids: [uuid])
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

      def to_s
        cdn_url
      end

      private

      def resolve_client
        @client || Uploadcare::Rails.client
      end

      def request_file_info_from_api
        resource = resolve_client.files.find(uuid: uuid)
        resource_to_hash(resource).merge("cdn_url" => cdn_url)
      end

      def resource_to_hash(resource)
        resource.class::ATTRIBUTES.each_with_object({}) do |attribute, result|
          result[attribute.to_s] = resource.public_send(attribute)
        end
      end
    end
  end
end
