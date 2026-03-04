# frozen_string_literal: true

require "active_job"

module Uploadcare
  module Rails
    # A job storing files to Uploadcare
    class StoreFileJob < ActiveJob::Base
      # Stores an Uploadcare file by UUID.
      # @param file_uuid [String, nil]
      # @param config_options [Hash]
      # @return [void]
      def perform(file_uuid, config_options = {})
        return unless file_uuid

        config = Uploadcare::Rails.build_client_config(config_options)
        Uploadcare::FileApi.store_file(file_uuid, config: config)
      end
    end
  end
end
