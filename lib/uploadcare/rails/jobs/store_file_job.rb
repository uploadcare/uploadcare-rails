# frozen_string_literal: true

require 'active_job'

module Uploadcare
  module Rails
    # A job storing files to Uploadcare
    class StoreFileJob < ActiveJob::Base
      def perform(file_uuid)
        Uploadcare::FileApi.store_file(file_uuid) if file_uuid
      end
    end
  end
end
