# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/objects/group'
require 'rails/all'

describe Uploadcare::Rails::Group do
  let(:group) do
    described_class.new(
      cdn_url: 'https://ucarecdn.com/6053b054-b8d4-4f57-992d-94b8f1d6ba65~2/',
      id: '6053b054-b8d4-4f57-992d-94b8f1d6ba65~2',
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
    it 'stores a group', :aggregate_failures do
      VCR.use_cassette 'group_api_store_group' do
        response = group.store
        expect(response).to eq('200 OK')
      end
    end
  end

  context 'when checking group to_s method' do
    it 'returns the cdn_url of a group' do
      expect(group.to_s).to eq group.cdn_url
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

    it 'sends a :new method to the transformator_class', :aggregate_failures do
      expect(transformator_class).to receive(:new).with(transformation_args)
      expect(subject).to contain_exactly(*expected_urls)
    end
  end
end
