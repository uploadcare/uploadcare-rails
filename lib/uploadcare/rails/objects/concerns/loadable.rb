# frozen_string_literal: true

module Uploadcare
  module Rails
    # Namespace for reusable object helpers.
    module Objects
      # A module that contains methods for attribute assignation and caching
      module Loadable
        extend ActiveSupport::Concern

        class_methods do
          # Builds a cache key for Uploadcare objects.
          # @param key [String]
          # @return [Array<String>]
          def build_cache_key(key)
            [uploadcare_configuration.cache_namespace, key].flatten.reject(&:blank?)
          end

          # Returns uploadcare-rails global configuration.
          # @return [Uploadcare::Rails::Configuration]
          def uploadcare_configuration
            Uploadcare::Rails.configuration
          end
        end

        # Assigns attributes from hash to the current object.
        # @param new_attrs [Hash]
        # @return [Object]
        def update_attrs(new_attrs)
          return self if new_attrs.nil?
          raise ArgumentError, 'new_attrs must be a Hash' unless new_attrs.is_a?(Hash)

          new_attrs.each do |key, value|
            setter = "#{key}="
            public_send(setter, value) if respond_to?(setter)
          end
          self
        end

        # Returns cache expiration value.
        # @return [Integer, ActiveSupport::Duration]
        def cache_expires_in
          uploadcare_configuration.cache_expires_in
        end

        def caching_enabled?
          uploadcare_configuration.cache_files
        end

        # Returns per-object Uploadcare configuration.
        # @return [Uploadcare::Rails::Configuration]
        def uploadcare_configuration
          self.class.uploadcare_configuration
        end

        # Returns cache key for current object.
        # @return [Array<String>]
        def cache_key
          self.class.build_cache_key(cdn_url)
        end
      end
    end
  end
end
