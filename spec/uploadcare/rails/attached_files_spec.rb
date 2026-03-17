# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/attached_files'
require 'rails/all'

describe Uploadcare::Rails::AttachedFiles do
  let(:group) do
    described_class.new(
      { cdn_url: 'https://ucarecdn.com/6053b054-b8d4-4f57-992d-94b8f1d6ba65~2/',
        id: '6053b054-b8d4-4f57-992d-94b8f1d6ba65~2',
        files_count: '2' }
    )
  end
  let(:config) { Struct.new(:cache_files, :cache_expires_in, :cache_namespace).new(true, 300, nil) }
  let(:memory_store) { ActiveSupport::Cache.lookup_store(:memory_store) }

  before do
    allow(Rails).to receive(:cache).and_return(memory_store)
    allow(Uploadcare::Rails).to receive(:configuration).and_return(config)
    Rails.cache.clear
  end

  it 'initializes with attributes' do
    expect(group.id).to eq('6053b054-b8d4-4f57-992d-94b8f1d6ba65~2')
    expect(group.files_count).to eq('2')
  end

  it 'preserves false-valued boolean attributes' do
    g = described_class.new({ is_image: false, is_ready: false })
    expect(g.is_image).to eq(false)
    expect(g.is_ready).to eq(false)
  end

  it 'returns cdn_url from to_s' do
    expect(group.to_s).to eq group.cdn_url
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

    it 'builds transformed urls' do
      expect(transformator_class).to receive(:new).with(transformation_args)
      expect(subject).to contain_exactly(*expected_urls)
    end
  end

  context 'when store is called' do
    it 'fetches group then batch-stores its files' do
      group_resource = double(files: [ { 'uuid' => 'file-1' }, { 'uuid' => 'file-2' } ])
      groups_accessor = double
      files_accessor = double
      client = double(groups: groups_accessor, files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: group.id).and_return(group_resource)
      expect(files_accessor).to receive(:batch_store).with(uuids: %w[file-1 file-2])

      group.store
    end

    it 'skips batch_store when group has no files' do
      group_resource = double(files: [])
      groups_accessor = double
      files_accessor = double
      client = double(groups: groups_accessor, files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: group.id).and_return(group_resource)
      expect(files_accessor).not_to receive(:batch_store)

      group.store
    end
  end

  context 'when delete is called' do
    it 'deletes the group via SDK resource' do
      group_resource = double
      groups_accessor = double
      client = double(groups: groups_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: group.id).and_return(group_resource)
      expect(group_resource).to receive(:delete)

      group.delete
    end
  end

  context 'when load is forced' do
    it 'clears the cache before fetching fresh data' do
      resource_class = Class.new do
        self::ATTRIBUTES = [ :id, :cdn_url, :datetime_created, :files_count, :files ]
        attr_accessor(*self::ATTRIBUTES)
      end
      group_resource = resource_class.new
      group_resource.id = group.id
      group_resource.cdn_url = group.cdn_url
      group_resource.datetime_created = Time.now
      group_resource.files_count = group.files_count
      group_resource.files = []
      groups_accessor = double
      client = double(groups: groups_accessor)

      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(groups_accessor).to receive(:find).with(group_id: group.id).and_return(group_resource)

      Rails.cache.write(group.cache_key, { "id" => group.id, "cdn_url" => group.cdn_url, "datetime_created" => nil })

      group.load(force: true)

      expect(group.datetime_created).to eq(group_resource.datetime_created)
    end
  end
end
