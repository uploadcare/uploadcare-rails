# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      module FileUuidExtraction
        private

        def extract_file_uuid(file)
          return file.uuid if file.respond_to?(:uuid)
          return file["uuid"] || file[:uuid] if file.is_a?(Hash)

          nil
        end
      end
    end
  end
end
