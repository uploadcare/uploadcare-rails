# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      class ImageTransformations
        def initialize(options = {})
          raise ArgumentError, "Options argument must be a Hash, #{options.class} is given?" unless options.is_a?(Hash)

          @options = options.to_h { |k, v| [ k.to_sym, v ] }
        end

        def call
          options_to_a.compact.join("-").squeeze("/").gsub(/\s/, "").presence
        end

        private

        attr_reader :options

        def options_to_a
          options.map do |key, value|
            "/#{key}/#{adjusted_value(value)}/"
          end
        end

        def adjusted_value(value)
          case value
          when Hash
            value.values.join("/")
          when TrueClass, FalseClass, "true", "false"
            nil
          when Array
            value.join(",")
          else
            value
          end
        end
      end
    end

    module Transformations
      ImageTransformations = Internal::ImageTransformations
    end
  end
end
