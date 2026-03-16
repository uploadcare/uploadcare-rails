# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/objects/file'
require 'rails/all'

describe Uploadcare::Rails::File do
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

  it 'accepts a client' do
    client = double('client')
    f = described_class.new({ uuid: 'abc' }, client: client)
    expect(f.uuid).to eq('abc')
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
    it 'calls client.files.find and store' do
      resource = double(store: nil, cdn_url: file.cdn_url)
      allow(resource).to receive(:class).and_return(
        Class.new { self::ATTRIBUTES = [:uuid, :cdn_url, :datetime_uploaded]; attr_accessor(*self::ATTRIBUTES) }
      )
      allow(resource).to receive_messages(uuid: file.uuid, cdn_url: file.cdn_url, datetime_uploaded: Time.now)

      files_accessor = double
      client = double(files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(files_accessor).to receive(:find).with(uuid: file.uuid).and_return(resource)

      file.store
      expect(resource).to have_received(:store)
    end
  end

  context 'when delete is called' do
    it 'calls client.files.batch_delete' do
      files_accessor = double
      client = double(files: files_accessor)
      allow(Uploadcare::Rails).to receive(:client).and_return(client)
      allow(files_accessor).to receive(:batch_delete).with(uuids: [file.uuid])

      file.delete
      expect(files_accessor).to have_received(:batch_delete).with(uuids: [file.uuid])
    end
  end
end
