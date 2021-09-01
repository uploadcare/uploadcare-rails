# frozen_string_literal: true

require 'active_job'

module Uploadcare
  module Rails
    # A job storing files from Uploadcare
    class UploadcareStoreFileJob < ActiveJob::Base
      def perform(class_name, file_uuid)
        class_name.constantize.uploadcare_perform_file_storing(file_uuid)
      end
    end
  end
end
