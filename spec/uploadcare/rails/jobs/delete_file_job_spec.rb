# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/jobs/delete_file_job'

RSpec.describe Uploadcare::Rails::DeleteFileJob, type: :job do
  describe '#perform_later' do
    it 'performs a delete file job' do
      ActiveJob::Base.queue_adapter = :test
      expect do
        described_class.perform_later(SecureRandom.uuid)
      end.to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
    end
  end

  describe '#perform' do
    it 'deletes a file with default config' do
      expect(Uploadcare::FileApi).to receive(:delete_file).with('file-uuid', config: Uploadcare.configuration)

      described_class.new.perform('file-uuid')
    end

    it 'deletes a file with provided config options' do
      expect(Uploadcare::FileApi).to receive(:delete_file) do |uuid, config:|
        expect(uuid).to eq('file-uuid')
        expect(config).to be_a(Uploadcare::Configuration)
        expect(config.public_key).to eq('pk')
        expect(config.secret_key).to eq('sk')
      end

      described_class.new.perform('file-uuid', { public_key: 'pk', secret_key: 'sk' })
    end

    it 'does nothing when uuid is nil' do
      expect(Uploadcare::FileApi).not_to receive(:delete_file)

      described_class.new.perform(nil)
    end
  end
end
