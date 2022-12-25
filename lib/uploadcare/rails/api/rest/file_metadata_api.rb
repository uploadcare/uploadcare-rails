# frozen_string_literal: true

require 'uploadcare/rails/api/rest/base'

module Uploadcare
  module Rails
    module Api
      module Rest
        # A class that contains FileMetadata related methods for Uploadcare REST API
        class FileMetadataApi < Base
          class << self
            # Get file's metadata keys and values
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/fileMetadata
            def file_metadata(uuid)
              Uploadcare::FileMetadata.index(uuid)
            end

            # Get the value of a single metadata key
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/fileMetadataKey
            def file_metadata_value(uuid, key)
              Uploadcare::FileMetadata.show(uuid, key)
            end

            # Update the value of a single metadata key. If the key does not exist, it will be created
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/updateFileMetadataKey
            def update_file_metadata(uuid, key, value)
              Uploadcare::FileMetadata.update(uuid, key, value)
            end

            # Delete a file's metadata key
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/deleteFileMetadataKey
            def delete_file_metadata(uuid, key)
              Uploadcare::FileMetadata.delete(uuid, key)
            end
          end
        end
      end
    end
  end
end

Uploadcare::FileMetadataApi = Uploadcare::Rails::Api::Rest::FileMetadataApi
