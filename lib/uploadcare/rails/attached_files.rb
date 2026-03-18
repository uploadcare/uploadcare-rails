# frozen_string_literal: true

require "uploadcare/rails/internal/image_transformations"
require "uploadcare/rails/internal/attachment_loading"

module Uploadcare
  module Rails
    class AttachedFiles
      include Internal::AttachmentLoading

      ATTRIBUTES = %i[
        id cdn_url datetime_created files_count files
        datetime_removed datetime_stored datetime_uploaded
        is_image is_ready mime_type original_file_url original_filename
        size url uuid variations content_info metadata appdata source
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

      def transform_file_urls(
        transformations,
        transformator_class = Transformations::ImageTransformations
      )
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        map_file_urls do |index|
          [ group_file_url(index), transformations_query ].compact.join("-")
        end
      end

      def file_urls
        map_file_urls do |index|
          group_file_url(index)
        end
      end

      def store
        client = resolve_client
        group_resource = client.groups.find(group_id: id)
        file_uuids = Array(group_resource.files).filter_map { |f| f["uuid"] || f[:uuid] }
        client.files.batch_store(uuids: file_uuids) if file_uuids.any?
        group_resource
      end

      def delete
        resolve_client.groups.find(group_id: id).delete
      end

      def load(force: false)
        ::Rails.cache.delete(cache_key) if force && caching_enabled?

        group_info = if caching_enabled?
                       ::Rails.cache.fetch(cache_key, expires_in: cache_expires_in) do
                         request_group_info_from_api
                       end
        else
                       request_group_info_from_api
        end
        update_attrs(group_info)
      end

      def loaded?
        datetime_created.present?
      end

      def to_s
        cdn_url
      end

      private

      def resolve_client
        @client || Uploadcare::Rails.client
      end

      def request_group_info_from_api
        resource = resolve_client.groups.find(group_id: id)
        resource_to_hash(resource)
      end

      def group_file_url(index)
        "#{cdn_url}nth/#{index}/"
      end

      def map_file_urls(&block)
        return [] unless block_given?

        Array.new(files_count.to_i, &block)
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
    end
  end
end
