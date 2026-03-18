# frozen_string_literal: true

require "uploadcare/rails/internal/image_transformations"
require "uploadcare/rails/internal/attachment_loading"

module Uploadcare
  module Rails
    class AttachedFile
      include Internal::AttachmentLoading

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
        [ cdn_url, transformations_query ].compact.join("-")
      end

      def store
        resource = resolve_client.files.find(uuid: uuid)
        resource.store
        file_info = file_info_from_resource(resource)
        ::Rails.cache.write(cache_key, file_info, expires_in: cache_expires_in) if caching_enabled?
        update_attrs(file_info)
      end

      def delete
        resolve_client.files.batch_delete(uuids: [ uuid ])
      end

      def load(force: false)
        ::Rails.cache.delete(cache_key) if force && caching_enabled?

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

      def cache_identity
        cdn_url.presence || uuid
      end

      def resolve_client
        @client || Uploadcare::Rails.client
      end

      def request_file_info_from_api
        resource = resolve_client.files.find(uuid: uuid)
        file_info_from_resource(resource)
      end

      def resource_to_hash(resource)
        return resource.to_h.transform_keys(&:to_s) if resource.respond_to?(:to_h)
        return resource.attributes.transform_keys(&:to_s) if resource.respond_to?(:attributes)

        extract_resource_attributes(resource).each_with_object({}) do |attribute, result|
          result[attribute.to_s] = resource.public_send(attribute)
        end
      end

      def extract_resource_attributes(resource)
        return resource.class::ATTRIBUTES if resource.class.const_defined?(:ATTRIBUTES, false)

        resource.public_methods(false).select do |method_name|
          resource.method(method_name).arity.zero? && method_name.to_s !~ /[=?!]/
        end
      end

      def file_info_from_resource(resource)
        resource_hash = resource_to_hash(resource)
        resolved_cdn_url = cdn_url.presence || resource_hash["cdn_url"].presence || resource_hash["url"]
        resource_hash.merge("cdn_url" => resolved_cdn_url)
      end
    end
  end
end
