# frozen_string_literal: true

require 'uploadcare/rails/api/rest/base'

module Uploadcare
  module Rails
    module Api
      module Rest
        # A class that contains AddonsApi related methods for Uploadcare REST API
        class AddonsApi < Base
          class << self
            # Execute ClamAV virus checking Add-On for a given target.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/ucClamavVirusScanExecute
            def virus_scan(uuid, params = {})
              Uploadcare::Addons.uc_clamav_virus_scan(uuid, params)
            end

            # Check the status of an Add-On execution request that had been started using the Execute Add-On operation.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/ucClamavVirusScanExecutionStatus
            def virus_scan_status(uuid)
              Uploadcare::Addons.uc_clamav_virus_scan_status(uuid)
            end

            # Execute AWS Rekognition Add-On for a given target to detect labels in an image.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/awsRekognitionExecute
            def rekognition_detect_labels(uuid)
              Uploadcare::Addons.ws_rekognition_detect_labels(uuid)
            end

            # Check the status of an Add-On execution request that had been started using the Execute Add-On operation.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/awsRekognitionExecutionStatus
            def rekognition_detect_labels_status(uuid)
              Uploadcare::Addons.ws_rekognition_detect_labels_status(uuid)
            end

            # Execute remove.bg background image removal Add-On for a given target.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/removeBgExecute
            def remove_bg(uuid, params = {})
              Uploadcare::Addons.remove_bg(uuid, params)
            end

            # Check the status of an Add-On execution request that had been started using the Execute Add-On operation.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/removeBgExecutionStatus
            def remove_bg_status(uuid)
              Uploadcare::Addons.remove_bg_status(uuid)
            end
          end
        end
      end
    end
  end
end

Uploadcare::AddonsApi = Uploadcare::Rails::Api::Rest::AddonsApi
