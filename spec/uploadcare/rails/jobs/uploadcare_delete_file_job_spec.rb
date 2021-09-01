# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/jobs/uploadcare_delete_file_job'

RSpec.describe Uploadcare::Rails::UploadcareDeleteFileJob, type: :job do
  describe '#perform_later' do
    it 'perform a delete file job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        described_class.perform_later(SecureRandom.uuid)
      end.to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
    end
  end
end
