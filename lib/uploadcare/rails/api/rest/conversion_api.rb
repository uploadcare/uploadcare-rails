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
            def convert_video(video_params, options = nil, config: Uploadcare.configuration, **kwargs)
              merged_options = (options || {}).merge(kwargs)
              Uploadcare::VideoConverter.convert(params: video_params, options: merged_options, config: config)
            end

            # Returns a status of video conversion job
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/videoConvertStatus
            def get_video_conversion_status(token, config: Uploadcare.configuration)
              Uploadcare::VideoConverter.new({}, config).fetch_status(token: token)
            end

            # Conversion formats info
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/Conversion/operation/documentConvertInfo
            def get_document_conversion_formats_info(uuid, config: Uploadcare.configuration)
              Uploadcare::DocumentConverter.new({}, config).info(uuid: uuid)
            end

            # Converts documents
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/documentConvert
            def convert_document(document_params, options = nil, config: Uploadcare.configuration, **kwargs)
              merged_options = (options || {}).merge(kwargs)
              Uploadcare::DocumentConverter.convert_document(
                params: document_params,
                options: merged_options,
                config: config
              )
            end

            # Returns a status of video conversion job
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/documentConvertStatus
            def get_document_conversion_status(token, config: Uploadcare.configuration)
              Uploadcare::DocumentConverter.new({}, config).fetch_status(token: token)
            end
          end
        end
      end
    end
  end
end

Uploadcare::ConversionApi = Uploadcare::Rails::Api::Rest::ConversionApi
