# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      class FilesCountExtractor
        class << self
          def call(input_str)
            return unless input_str.present? && input_str.include?("~")

            input_str.split("~").last
          end
        end
      end
    end

    FilesCountExtractor = Internal::FilesCountExtractor
  end
end
