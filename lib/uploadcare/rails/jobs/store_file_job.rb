# frozen_string_literal: true

require "active_job"

module Uploadcare
  module Rails
    class StoreFileJob < ActiveJob::Base
      queue_as { Uploadcare::Rails.configuration.job_queue || :default }
      retry_on Uploadcare::Exception::RequestError, Uploadcare::Exception::ThrottleError,
               wait: :polynomially_longer, attempts: 3
      discard_on ActiveJob::DeserializationError

      def perform(file_uuid, client_options = {})
        return if file_uuid.blank?

        client = Uploadcare::Rails.build_client_from_options(client_options)
        client.files.batch_store(uuids: [ file_uuid ])
      end
    end
  end
end
