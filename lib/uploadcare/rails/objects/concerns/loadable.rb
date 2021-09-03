# frozen_string_literal: true

require 'active_record'

module Uploadcare
  module Rails
    module Objects
      # A module that contains methods for attribute assignation and caching
      module Loadable
        extend ActiveSupport::Concern
        include ::ActiveRecord::AttributeAssignment

        class_methods do
          def build_cache_key(key)
            [uploadcare_configuration.cache_namespace, key].flatten.reject(&:blank?)
          end

          def uploadcare_configuration
            Uploadcare::Rails.configuration
          end
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
          self.class.build_cache_key(cdn_url)
        end
      end
    end
  end
end
