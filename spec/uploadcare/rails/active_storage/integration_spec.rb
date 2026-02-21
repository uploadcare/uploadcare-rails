# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/active_storage/integration'

RSpec.describe Uploadcare::Rails::ActiveStorage::Integration do
  describe '.install_previewer' do
    it 'adds uploadcare previewer once' do
      previewers = []

      described_class.install_previewer(previewers)
      described_class.install_previewer(previewers)

      expect(previewers.count(Uploadcare::Rails::ActiveStorage::UploadcarePreviewer)).to eq(1)
    end

    it 'does not fail when previewers is nil' do
      expect { described_class.install_previewer(nil) }.not_to raise_error
    end
  end

  describe '.install_variant_remote_processing' do
    it 'prepends remote processing module once' do
      stub_const('ActiveStorage::Variant', Class.new)
      stub_const('ActiveStorage::VariantWithRecord', Class.new)

      described_class.install_variant_remote_processing
      described_class.install_variant_remote_processing

      expect(ActiveStorage::Variant.ancestors.count(Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing)).to eq(1)
      variant_with_record_count = ActiveStorage::VariantWithRecord.ancestors.count(
        Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing
      )
      expect(variant_with_record_count).to eq(1)
    end
  end
end
