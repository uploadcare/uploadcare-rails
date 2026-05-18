# frozen_string_literal: true

require "active_job"
require "uploadcare/rails/attached_files"

module Uploadcare
  module Rails
    class StoreGroupJob < ActiveJob::Base
      queue_as { Uploadcare::Rails.configuration.job_queue || :default }
      retry_on Uploadcare::Exception::RequestError, Uploadcare::Exception::ThrottleError,
               wait: :polynomially_longer, attempts: 3
      discard_on ActiveJob::DeserializationError

      def perform(group_id)
        return if group_id.blank?

        client = Uploadcare::Rails.client
        AttachedFiles.new({ id: group_id }, client: client).store
      end
    end
  end
end
