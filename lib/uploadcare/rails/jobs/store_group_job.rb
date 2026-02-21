# frozen_string_literal: true

require 'active_job'

module Uploadcare
  module Rails
    # A job storing group files to Uploadcare
    class StoreGroupJob < ActiveJob::Base
      # Stores an Uploadcare group by group id.
      # @param group_id [String, nil]
      # @param config_options [Hash]
      # @return [void]
      def perform(group_id, config_options = {})
        return unless group_id

        config = Uploadcare::Rails.build_client_config(config_options)
        Uploadcare::GroupApi.store_group(group_id, config: config)
      end
    end
  end
end
