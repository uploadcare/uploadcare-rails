# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/jobs/store_file_job'

RSpec.describe Uploadcare::Rails::StoreFileJob, type: :job do
  describe '#perform_later' do
    it 'enqueues a store file job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        described_class.perform_later(SecureRandom.uuid)
      end.to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
    end
  end

  describe '#perform' do
    it 'stores a file using default client' do
      files_accessor = double
      client = double(files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      expect(files_accessor).to receive(:batch_store).with(uuids: ['file-uuid'])

      described_class.new.perform('file-uuid')
    end

    it 'stores a file with provided client options' do
      files_accessor = double
      client = double(files: files_accessor)
      allow(Uploadcare::Client).to receive(:new).with(public_key: 'pk', secret_key: 'sk').and_return(client)
      expect(files_accessor).to receive(:batch_store).with(uuids: ['file-uuid'])

      described_class.new.perform('file-uuid', { public_key: 'pk', secret_key: 'sk' })
    end

    it 'does nothing when uuid is nil' do
      expect(Uploadcare::Rails).not_to receive(:client)

      described_class.new.perform(nil)
    end
  end
end
