# frozen_string_literal: true

require 'uploadcare'
require 'uploadcare/rails/api/rest/group_api'
require 'uploadcare/rails/transformations/image_transformations'
require 'uploadcare/rails/objects/concerns/assign_attributes'

module Uploadcare
  module Rails
    # A wrapper class that for Uploadcare::Group object.
    # Allows caching loaded groups and has methods for Rails model attributes
    class Group < Uploadcare::Entity::Group
      include Uploadcare::Rails::Objects::SetAttributes

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
        file_info = Uploadcare::GroupApi.store_group(id)
        assign_attributes(file_info)
        ::Rails.cache.write(cdn_url, file_info) if uploadcare_configuration.cache_files
        self
      end

      def to_s
        cdn_url
      end

      def load
        file_info = Uploadcare::GroupApi.get_group(id)
        assign_attributes(file_info)
        ::Rails.cache.write(cdn_url, self) if uploadcare_configuration.cache_files
        self
      end

      def loaded?
        datetime_created.present?
      end

      private

      def group_file_url(index)
        "#{cdn_url}nth/#{index}/"
      end

      def map_file_urls(&block)
        return [] unless block_given?

        Array.new(files_count.to_i, &block)
      end

      def uploadcare_configuration
        Uploadcare::Rails.configuration
      end
    end
  end
end
