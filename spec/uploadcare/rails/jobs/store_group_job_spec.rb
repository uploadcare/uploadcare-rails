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

  describe '#perform' do
    it 'stores a group with default config' do
      expect(Uploadcare::GroupApi).to receive(:store_group).with('group-id', config: Uploadcare.configuration)

      described_class.new.perform('group-id')
    end

    it 'stores a group with provided config options' do
      expect(Uploadcare::GroupApi).to receive(:store_group) do |group_id, config:|
        expect(group_id).to eq('group-id')
        expect(config).to be_a(Uploadcare::Configuration)
        expect(config.public_key).to eq('pk')
        expect(config.secret_key).to eq('sk')
      end

      described_class.new.perform('group-id', { public_key: 'pk', secret_key: 'sk' })
    end

    it 'does nothing when group id is nil' do
      expect(Uploadcare::GroupApi).not_to receive(:store_group)

      described_class.new.perform(nil)
    end
  end
end
