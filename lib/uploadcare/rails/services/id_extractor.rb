# frozen_string_literal: true

module Uploadcare
  module Rails
    # A class extracting an ID of an object from an URL.
    class IdExtractor
      class << self
        # regex is an UUID-regex by default
        def call(input_str, regex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)
          input_str.match(regex).to_s
        end
      end
    end
  end
end
