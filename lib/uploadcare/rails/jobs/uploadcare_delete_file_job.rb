# frozen_string_literal: true

require 'active_job'

module Uploadcare
  module Rails
    # A job deleting files from Uploadcare
    class UploadcareDeleteFileJob < ActiveJob::Base
      def perform(class_name, file_uuid)
        class_name.constantize.uploadcare_perform_file_deleting(file_uuid)
      end
    end
  end
end
