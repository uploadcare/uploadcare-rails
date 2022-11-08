# frozen_string_literal: true

require 'uploadcare/rails/api/upload/base'

module Uploadcare
  module Rails
    module Api
      module Upload
        # A client for general uploads
        #
        # @see https://uploadcare.com/api-refs/upload-api/#tag/Upload
        class UploadApi < Base
          class << self
            # Uploads single files smaller. Supports small (less that 100 MB) and large single files.
            #
            # @see https://uploadcare.com/api-refs/upload-api/#operation/baseUpload
            # @see https://uploadcare.com/api-refs/upload-api/#operation/multipartFileUploadStart
            def upload_file(file, options = {})
              return upload(file, options) if file?(file) || file.is_a?(String)

              raise TypeError, "The first argument must be a File or String (URL), #{file.class} given"
            end

            # Uploads several files smaller than 100MB.
            #
            # https://uploadcare.com/api-refs/upload-api/#operation/multipartFileUploadStart
            def upload_files(files, options = {})
              return upload(files, options) if array_of_files?(files)

              raise TypeError, 'The first argument must be an Array of File objects'
            end

            private

            def array_of_files?(files)
              files.is_a?(Array) && files.all? { |file| file?(file) }
            end

            def file?(object)
              object.respond_to?(:path) && ::File.exist?(object.path)
            end

            def upload(files, options = {})
              Uploadcare::Uploader.upload(files, options)
            end
          end
        end
      end
    end
  end
end

Uploadcare::UploadApi = Uploadcare::Rails::Api::Upload::UploadApi
