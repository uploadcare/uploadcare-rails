# frozen_string_literal: true

require 'active_support/concern'
module Uploadcare
  module Rails
    module Objects
      # A module containing assign_attributes methods for Uploadcare::Rails objects
      module SetAttributes
        extend ActiveSupport::Concern

        private

        def assign_attributes(attrs = {})
          attrs.each_pair do |name, value|
            assign_attribute(name, value)
          end
        end

        def assign_attribute(name, value)
          send("#{name}=", value)
        rescue NoMethodError
          nil
        end
      end
    end
  end
end
