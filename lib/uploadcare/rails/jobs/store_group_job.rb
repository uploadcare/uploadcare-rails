# frozen_string_literal: true

require "active_job"
require "uploadcare/rails/internal/file_uuid_extraction"

module Uploadcare
  module Rails
    class StoreGroupJob < ActiveJob::Base
      include Internal::FileUuidExtraction

      queue_as { Uploadcare::Rails.configuration.job_queue || :default }
      retry_on Uploadcare::Exception::RequestError, Uploadcare::Exception::ThrottleError,
               wait: :polynomially_longer, attempts: 3
      discard_on ActiveJob::DeserializationError

      def perform(group_id, client_options = {})
        return if group_id.blank?

        client = Uploadcare::Rails.build_client_from_options(client_options)
        group_resource = client.groups.find(group_id: group_id)
        file_uuids = Array(group_resource.files).filter_map { |file| extract_file_uuid(file) }
        client.files.batch_store(uuids: file_uuids) if file_uuids.any?
      end
    end
  end
end
