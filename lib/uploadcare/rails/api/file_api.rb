# frozen_string_literal: true

require 'uploadcare/rails/api/base'

module Uploadcare
  module Rails
    module Api
      # A class that contains File related methods for Uploadcare REST API
      class FileApi < Base
        class << self
          # Returns a pagination json of files stored in project
          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/filesList
          #
          # valid options:
          # removed: [true|false]
          # stored: [true|false]
          # limit: (1..1000)
          # order: ["datetime_uploaded"|"-datetime_uploaded"|"size"|"-size"]
          # from: number of files to offset
          def get_files(**options)
            Uploadcare::FileList.file_list(**options)
          end

          # Acquire file info
          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/fileInfo
          def get_file(uuid)
            Uploadcare::File.info(uuid)
          end

          # 'copy' method is used to copy original files or their modified versions to default storage.
          # Source files MAY either be stored or just uploaded and MUST NOT be deleted.
          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/copyFile
          def copy_file(source, **options)
            Uploadcare::File.copy(source, **options)
          end

          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/deleteFile
          def delete_file(uuid)
            Uploadcare::File.delete(uuid)
          end

          # Store a single file, preventing it from being deleted in 2 weeks
          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/storeFile
          def store_file(uuid)
            Uploadcare::File.store(uuid)
          end

          # Make a set of files "stored". This will prevent them from being deleted automatically
          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/filesStoring
          # uuids: Array
          def store_files(uuids)
            Uploadcare::FileList.batch_store(uuids)
          end

          # Delete several files by list of uids
          # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/filesDelete
          # uuids: Array
          def delete_files(uuids)
            Uploadcare::FileList.batch_delete(uuids)
          end
        end
      end
    end
  end
end

Uploadcare::FileApi = Uploadcare::Rails::Api::FileApi
