# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      class IdExtractor
        UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/

        class << self
          def call(input_str, regex = UUID_REGEX)
            return unless input_str.present?

            input_str.match(regex)&.to_s
          end
        end
      end
    end

    IdExtractor = Internal::IdExtractor
  end
end
