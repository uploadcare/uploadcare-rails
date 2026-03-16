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
    it 'finds a group using default client' do
      groups_accessor = double
      client = double(groups: groups_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      expect(groups_accessor).to receive(:find).with(group_id: 'group-id')

      described_class.new.perform('group-id')
    end

    it 'finds a group with provided client options' do
      groups_accessor = double
      client = double(groups: groups_accessor)
      allow(Uploadcare::Client).to receive(:new).with(public_key: 'pk', secret_key: 'sk').and_return(client)
      expect(groups_accessor).to receive(:find).with(group_id: 'group-id')

      described_class.new.perform('group-id', { public_key: 'pk', secret_key: 'sk' })
    end

    it 'does nothing when group id is nil' do
      expect(Uploadcare::Rails).not_to receive(:client)

      described_class.new.perform(nil)
    end
  end
end
