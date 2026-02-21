# frozen_string_literal: true

module Uploadcare
  module Rails
    # A class extracting the files count param of a file group from a group ID.
    class FilesCountExtractor
      class << self
        # Extracts files count from Uploadcare group id.
        # @param input_str [String, nil]
        # @return [String, nil]
        def call(input_str)
          input_str.split('~').last if input_str.present?
        end
      end
    end
  end
end
