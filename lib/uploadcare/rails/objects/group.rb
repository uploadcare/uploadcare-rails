# frozen_string_literal: true

require "uploadcare/rails/transformations/image_transformations"
require "uploadcare/rails/objects/concerns/loadable"

module Uploadcare
  module Rails
    class Group
      include Objects::Loadable

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
          value = attributes[attr.to_s]
          instance_variable_set("@#{attr}", value) if value
        end
      end

      def transform_file_urls(
        transformations,
        transformator_class = Transformations::ImageTransformations
      )
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        map_file_urls do |index|
          [group_file_url(index), transformations_query].compact.join("-")
        end
      end

      def file_urls
        map_file_urls do |index|
          group_file_url(index)
        end
      end

      def store
        resolve_client.groups.find(group_id: id)
      end

      def load
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
        resource.class::ATTRIBUTES.each_with_object({}) do |attribute, result|
          result[attribute.to_s] = resource.public_send(attribute)
        end
      end

      def group_file_url(index)
        "#{cdn_url}nth/#{index}/"
      end

      def map_file_urls(&block)
        return [] unless block_given?

        Array.new(files_count.to_i, &block)
      end
    end
  end
end
