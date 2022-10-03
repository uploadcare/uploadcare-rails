# frozen_string_literal: true

require 'uploadcare/rails/api/rest/group_api'
require 'uploadcare/rails/transformations/image_transformations'
require 'uploadcare/rails/objects/concerns/loadable'

module Uploadcare
  module Rails
    # A wrapper class that for Uploadcare::Group object.
    # Allows caching loaded groups and has methods for Rails model attributes
    class Group < Uploadcare::Entity::Group
      include Objects::Loadable

      attr_entity(*superclass.entity_attributes)

      def transform_file_urls(
        transformations,
        transformator_class = Uploadcare::Rails::Transformations::ImageTransformations
      )
        return if cdn_url.blank?

        transformations_query = transformator_class.new(transformations).call if transformations.present?
        map_file_urls do |index|
          [group_file_url(index), transformations_query].compact.join('-')
        end
      end

      def file_urls
        map_file_urls do |index|
          group_file_url(index)
        end
      end

      def store
        Uploadcare::GroupApi.store_group(id)
      end

      def to_s
        cdn_url
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

      private

      def request_group_info_from_api
        Uploadcare::GroupApi.get_group(id).merge(self).to_h
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
