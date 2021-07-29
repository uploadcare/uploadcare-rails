# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/objects/group'
require 'rails/all'

describe Uploadcare::Rails::Group do
  let(:group) do
    described_class.new(
      cdn_url: 'https://ucarecdn.com/aeaeeb8d-43bc-444d-954f-a171fd872e58~2/',
      id: 'aeaeeb8d-43bc-444d-954f-a171fd872e58~2',
      files_count: '2'
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

  context 'when checking group storing' do
    it 'stores a file', :aggregate_failures do
      VCR.use_cassette 'group_api_store_group' do
        response = group.store
        expect(response[:id]).to eq group.id
        expect(group.loaded?).to be_truthy
      end
    end
  end

  context 'when checking file to_s method' do
    it 'returns the cdn_url of a file' do
      expect(group.to_s).to eq group.cdn_url
    end
  end

  context 'when checking group loading' do
    let(:group) do
      described_class.new(
        cdn_url: 'https://ucarecdn.com/8b1362ed-b477-4a15-819a-2c6bb497d8bd~3/',
        id: '8b1362ed-b477-4a15-819a-2c6bb497d8bd~3',
        files_count: '2'
      )
    end

    it 'checks that a file is not loaded by default' do
      expect(group.loaded?).to be_falsey
    end

    it 'checks that a group is loaded' do
      VCR.use_cassette 'group_api_get_group' do
        group.load
        expect(group.loaded?).to be_truthy
      end
    end
  end

  context 'when checking file urls' do
    let(:expected_urls) { Array.new(group.files_count.to_i) { |index| "#{group.cdn_url}nth/#{index}/" } }

    it 'returns file urls of a group' do
      expect(group.file_urls).to contain_exactly(*expected_urls)
    end
  end

  context 'when checking file urls transformations' do
    subject { group.transform_file_urls(**transformation_args) }

    let(:transformator_class) { Uploadcare::Rails::Transformations::ImageTransformations }
    let(:transformation_args) { { resize: '300x500' } }
    let(:transformations) { '/resize/300x500/' }
    let(:expected_urls) do
      Array.new(group.files_count.to_i) { |index| "#{group.cdn_url}nth/#{index}/-#{transformations}" }
    end

    before { allow(transformator_class).to receive_message_chain(:new, :call).and_return(transformations) }

    it 'sends a :new method to the transformator_class' do
      expect(transformator_class).to receive(:new).with(**transformation_args)
      expect(subject).to contain_exactly(*expected_urls)
    end
  end
end
