# frozen_string_literal: true

require "active_job"

module Uploadcare
  module Rails
    class StoreGroupJob < ActiveJob::Base
      def perform(group_id, client_options = {})
        return unless group_id

        client = Uploadcare::Rails.build_client_from_options(client_options)
        group_resource = client.groups.find(group_id: group_id)
        file_uuids = Array(group_resource.files).filter_map { |f| f["uuid"] || f[:uuid] }
        client.files.batch_store(uuids: file_uuids) if file_uuids.any?
      end
    end
  end
end
