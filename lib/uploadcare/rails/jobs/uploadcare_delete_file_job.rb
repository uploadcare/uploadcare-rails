# frozen_string_literal: true

require 'active_job'

module Uploadcare
  module Rails
    # A job deleting files from Uploadcare
    class UploadcareDeleteFileJob < ActiveJob::Base
      def perform(file_uuid)
        Uploadcare::FileApi.delete_file(file_uuid) if file_uuid
      end
    end
  end
end
