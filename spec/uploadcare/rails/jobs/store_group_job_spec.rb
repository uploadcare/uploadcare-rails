# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/jobs/store_group_job'

RSpec.describe Uploadcare::Rails::StoreGroupJob, type: :job do
  describe '#perform_later' do
    it 'performs a store file group job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        described_class.perform_later('id')
      end.to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
    end
  end
end
