# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      class FilesCountExtractor
        class << self
          def call(input_str)
            input_str.split("~").last if input_str.present?
          end
        end
      end
    end

    FilesCountExtractor = Internal::FilesCountExtractor
  end
end
