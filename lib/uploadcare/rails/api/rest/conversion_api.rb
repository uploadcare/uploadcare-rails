# frozen_string_literal: true

require 'uploadcare/rails/api/rest/base'

module Uploadcare
  module Rails
    module Api
      module Rest
        # A class that contains Conversion related methods for Uploadcare REST API
        class ConversionApi < Base
          class << self
            # Converts video files
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/videoConvert
            def convert_video(video_params, options = {})
              Uploadcare::VideoConverter.convert(video_params, options)
            end

            # Returns a status of video conversion job
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/videoConvertStatus
            def get_video_conversion_status(token)
              Uploadcare::VideoConverter.status(token)
            end

            # Conversion formats info
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/Conversion/operation/documentConvertInfo
            def get_document_conversion_formats_info(uuid)
              Uploadcare::DocumentConverter.info(uuid)
            end

            # Converts documents
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/documentConvert
            def convert_document(document_params, options = {})
              Uploadcare::DocumentConverter.convert(document_params, options)
            end

            # Returns a status of video conversion job
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/documentConvertStatus
            def get_document_conversion_status(token)
              Uploadcare::DocumentConverter.status(token)
            end
          end
        end
      end
    end
  end
end

Uploadcare::ConversionApi = Uploadcare::Rails::Api::Rest::ConversionApi
