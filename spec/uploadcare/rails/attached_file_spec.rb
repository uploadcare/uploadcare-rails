# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/attached_file'
require 'rails/all'

describe Uploadcare::Rails::AttachedFile do
  let(:file) do
    described_class.new(
      { cdn_url: 'https://ucarecdn.com/2254146d-3652-4419-abf6-305d36ef30a8/',
        uuid: '2254146d-3652-4419-abf6-305d36ef30a8' }
    )
  end
  let(:config) { OpenStruct.new(cache_files: true, cache_expires_in: 300, cache_namespace: nil) }
  let(:memory_store) { ActiveSupport::Cache.lookup_store(:memory_store) }

  before do
    allow(Rails).to receive(:cache).and_return(memory_store)
    allow(Uploadcare::Rails).to receive(:configuration).and_return(config)
    Rails.cache.clear
  end

  it 'initializes with attributes' do
    expect(file.uuid).to eq('2254146d-3652-4419-abf6-305d36ef30a8')
    expect(file.cdn_url).to eq('https://ucarecdn.com/2254146d-3652-4419-abf6-305d36ef30a8/')
  end

  it 'preserves false-valued boolean attributes' do
    f = described_class.new({ is_image: false, is_ready: false })
    expect(f.is_image).to eq(false)
    expect(f.is_ready).to eq(false)
  end

  it 'returns cdn_url from to_s' do
    expect(file.to_s).to eq file.cdn_url
  end

  it 'is not loaded by default' do
    expect(file.loaded?).to be_falsey
  end

  context 'when checking url transformations' do
    subject { file.transform_url(**transformation_args) }

    let(:transformator_class) { Uploadcare::Rails::Transformations::ImageTransformations }
    let(:transformation_args) { { resize: '300x500' } }
    let(:transformations) { '/resize/300x500/' }
    let(:new_url) { "#{file.cdn_url}-#{transformations}" }

    before { allow(transformator_class).to receive_message_chain(:new, :call).and_return(transformations) }

    it 'builds transformed url' do
      expect(transformator_class).to receive(:new).with(transformation_args)
      expect(subject).to eq new_url
    end
  end

  context 'when store is called' do
    it 'uses the provided client and tolerates resources without ATTRIBUTES' do
      timestamp = Time.now
      resource = double(
        store: nil,
        to_h: { uuid: file.uuid, cdn_url: file.cdn_url, datetime_uploaded: timestamp }
      )
      files_accessor = double
      client = double('custom-client', files: files_accessor)
      instance = described_class.new({ cdn_url: file.cdn_url, uuid: file.uuid }, client: client)

      expect(Uploadcare::Rails).not_to receive(:client)
      allow(files_accessor).to receive(:find).with(uuid: file.uuid).and_return(resource)

      instance.store

      expect(resource).to have_received(:store)
      expect(instance.datetime_uploaded).to eq(timestamp)
    end
  end

  context 'when delete is called' do
    it 'uses the provided client' do
      files_accessor = double
      client = double('custom-client', files: files_accessor)
      instance = described_class.new({ cdn_url: file.cdn_url, uuid: file.uuid }, client: client)

      expect(Uploadcare::Rails).not_to receive(:client)
      allow(files_accessor).to receive(:batch_delete).with(uuids: [ file.uuid ])

      instance.delete

      expect(files_accessor).to have_received(:batch_delete).with(uuids: [ file.uuid ])
    end
  end

  context 'when load is forced' do
    it 'clears the cache before fetching fresh data and uses the provided client' do
      files_accessor = double
      timestamp = Time.now
      resource = double(
        to_h: { uuid: file.uuid, cdn_url: file.cdn_url, datetime_uploaded: timestamp }
      )
      client = double('custom-client', files: files_accessor)
      instance = described_class.new({ cdn_url: file.cdn_url, uuid: file.uuid }, client: client)

      expect(Uploadcare::Rails).not_to receive(:client)
      allow(files_accessor).to receive(:find).with(uuid: file.uuid).and_return(resource)

      Rails.cache.write(instance.cache_key, { "uuid" => file.uuid, "cdn_url" => file.cdn_url, "datetime_uploaded" => nil })

      instance.load(force: true)

      expect(instance.datetime_uploaded).to eq(timestamp)
    end
  end

  context 'when initialized with only a uuid' do
    it 'uses the uuid as the cache identity and backfills cdn_url from the resource' do
      uuid = '2254146d-3652-4419-abf6-305d36ef30a8'
      files_accessor = double
      resource = double(
        to_h: {
          uuid: uuid,
          url: "https://ucarecdn.com/#{uuid}/",
          datetime_uploaded: Time.now
        }
      )
      client = double('custom-client', files: files_accessor)
      instance = described_class.new({ uuid: uuid }, client: client)

      allow(files_accessor).to receive(:find).with(uuid: uuid).and_return(resource)

      instance.load

      expect(instance.cdn_url).to eq("https://ucarecdn.com/#{uuid}/")
      expect(Rails.cache.read(described_class.build_cache_key(uuid))["cdn_url"]).to eq("https://ucarecdn.com/#{uuid}/")
    end
  end
end
