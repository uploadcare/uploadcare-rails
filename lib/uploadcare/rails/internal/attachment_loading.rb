# frozen_string_literal: true

require "active_support/concern"

module Uploadcare
  module Rails
    module Internal
      module AttachmentLoading
        extend ActiveSupport::Concern

        class_methods do
          def build_cache_key(key)
            [ uploadcare_configuration.cache_namespace, key ].flatten.reject(&:blank?)
          end

          def uploadcare_configuration
            Uploadcare::Rails.configuration
          end
        end

        def update_attrs(new_attrs)
          return self if new_attrs.nil?
          raise ArgumentError, "new_attrs must be a Hash" unless new_attrs.is_a?(Hash)

          new_attrs.each do |key, value|
            setter = "#{key}="
            public_send(setter, value) if respond_to?(setter)
          end
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
          self.class.build_cache_key(cache_identity)
        end

        def cache_identity
          cdn_url
        end

        def resource_to_hash(resource)
          return resource.to_h.transform_keys(&:to_s) if resource.respond_to?(:to_h)
          return resource.attributes.transform_keys(&:to_s) if resource.respond_to?(:attributes)

          if resource.class.const_defined?(:ATTRIBUTES, false)
            return resource.class::ATTRIBUTES.each_with_object({}) do |attribute, result|
              result[attribute.to_s] = resource.public_send(attribute)
            end
          end

          raise ArgumentError,
                "Unsupported Uploadcare resource #{resource.class}. Expected #to_h, #attributes, or class ATTRIBUTES."
        end
      end
    end
  end
end
