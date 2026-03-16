# frozen_string_literal: true

require "active_job"

module Uploadcare
  module Rails
    class StoreFileJob < ActiveJob::Base
      def perform(file_uuid, client_options = {})
        return unless file_uuid

        client = Uploadcare::Rails.build_client_from_options(client_options)
        client.files.batch_store(uuids: [file_uuid])
      end
    end
  end
end
