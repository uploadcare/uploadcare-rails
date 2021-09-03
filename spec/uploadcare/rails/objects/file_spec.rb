# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/objects/file'
require 'rails/all'

describe Uploadcare::Rails::File do
  let(:file) do
    described_class.new(
      cdn_url: 'https://ucarecdn.com/5ae54c37-754c-4982-8de4-3f242a88ce17/',
      uuid: '5ae54c37-754c-4982-8de4-3f242a88ce17'
    )
  end
  let(:cache) { Rails.cache }
  let(:config) { OpenStruct.new(cache_files: true) }
  let(:memory_store) { ActiveSupport::Cache.lookup_store(:memory_store) }

  before do
    allow(Rails).to receive(:cache).and_return(memory_store)
    allow(Uploadcare::Rails).to receive(:configuration).and_return(config)
    Rails.cache.clear
  end

  context 'when checking file storing' do
    it 'stores a file', :aggregate_failures do
      VCR.use_cassette 'file_api_store_file' do
        response = file.store
        expect(response[:uuid]).to eq file.uuid
        expect(file.loaded?).to be_truthy
      end
    end
  end

  context 'when checking file deleting' do
    it 'deletes a file' do
      VCR.use_cassette 'file_api_delete_file' do
        response = file.delete
        expect(response[:uuid]).to eq file.uuid
      end
    end
  end

  context 'when checking file to_s method' do
    it 'check the :to_s method' do
      expect(file.to_s).to eq file.cdn_url
    end
  end

  context 'when checking file loading' do
    it 'checks that a file is not loaded by default' do
      expect(file.loaded?).to be_falsey
    end

    it 'checks that a file is loaded' do
      VCR.use_cassette 'file_api_get_file' do
        file.load
        expect(file.loaded?).to be_truthy
      end
    end
  end

  context 'when checking url transformations' do
    subject { file.transform_url(**transformation_args) }

    let(:transformator_class) { Uploadcare::Rails::Transformations::ImageTransformations }
    let(:transformation_args) { { resize: '300x500' } }
    let(:transformations) { '/resize/300x500/' }
    let(:new_url) { "#{file.cdn_url}-#{transformations}" }

    before { allow(transformator_class).to receive_message_chain(:new, :call).and_return(transformations) }

    it 'checks that the transformator received :new method', :aggregate_failures do
      expect(transformator_class).to receive(:new).with(**transformation_args)
      expect(subject).to eq new_url
    end
  end
end
