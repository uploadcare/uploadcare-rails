# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/jobs/store_group_job'

RSpec.describe Uploadcare::Rails::StoreGroupJob, type: :job do
  describe '#perform_later' do
    it 'enqueues a store group job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        described_class.perform_later('id')
      end.to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
    end
  end

  describe '#perform' do
    it 'fetches group and batch-stores its files' do
      group_resource = double(files: [{ 'uuid' => 'f1' }, { 'uuid' => 'f2' }])
      groups_accessor = double
      files_accessor = double
      client = double(groups: groups_accessor, files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: 'group-id').and_return(group_resource)
      expect(files_accessor).to receive(:batch_store).with(uuids: %w[f1 f2])

      described_class.new.perform('group-id')
    end

    it 'fetches group and batch-stores with provided client options' do
      group_resource = double(files: [{ 'uuid' => 'f1' }])
      groups_accessor = double
      files_accessor = double
      client = double(groups: groups_accessor, files: files_accessor)
      allow(Uploadcare::Client).to receive(:new).with(public_key: 'pk', secret_key: 'sk').and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: 'group-id').and_return(group_resource)
      expect(files_accessor).to receive(:batch_store).with(uuids: %w[f1])

      described_class.new.perform('group-id', { public_key: 'pk', secret_key: 'sk' })
    end

    it 'skips batch_store when group has no files' do
      group_resource = double(files: [])
      groups_accessor = double
      files_accessor = double
      client = double(groups: groups_accessor, files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: 'group-id').and_return(group_resource)
      expect(files_accessor).not_to receive(:batch_store)

      described_class.new.perform('group-id')
    end

    it 'does nothing when group id is nil' do
      expect(Uploadcare::Rails).not_to receive(:client)

      described_class.new.perform(nil)
    end
  end
end
