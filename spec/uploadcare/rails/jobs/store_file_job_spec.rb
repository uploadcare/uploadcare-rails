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

  describe '#perform' do
    it 'stores a file with default config' do
      expect(Uploadcare::FileApi).to receive(:store_file).with('file-uuid', config: Uploadcare.configuration)

      described_class.new.perform('file-uuid')
    end

    it 'stores a file with provided config options' do
      expect(Uploadcare::FileApi).to receive(:store_file) do |uuid, config:|
        expect(uuid).to eq('file-uuid')
        expect(config).to be_a(Uploadcare::Configuration)
        expect(config.public_key).to eq('pk')
        expect(config.secret_key).to eq('sk')
      end

      described_class.new.perform('file-uuid', { public_key: 'pk', secret_key: 'sk' })
    end

    it 'does nothing when uuid is nil' do
      expect(Uploadcare::FileApi).not_to receive(:store_file)

      described_class.new.perform(nil)
    end
  end
end
