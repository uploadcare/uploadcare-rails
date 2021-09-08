# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/jobs/store_file_job'

RSpec.describe Uploadcare::Rails::StoreFileJob, type: :job do
  describe '#perform_later' do
    it 'performs a store file job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        described_class.perform_later(SecureRandom.uuid)
      end.to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
    end
  end
end
