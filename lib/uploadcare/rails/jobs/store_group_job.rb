# frozen_string_literal: true

require "active_job"

module Uploadcare
  module Rails
    class StoreGroupJob < ActiveJob::Base
      def perform(group_id, client_options = {})
        return unless group_id

        client = Uploadcare::Rails.build_client_from_options(client_options)
        client.groups.find(group_id: group_id)
      end
    end
  end
end
