# frozen_string_literal: true

require 'spec_helper'
require 'stringio'
require 'logger'
require 'base64'
require 'digest'
require 'active_storage/errors'
require 'active_storage/service/uploadcare_service'

RSpec.describe ActiveStorage::Service::UploadcareService do
  let(:service) { described_class.new(public_key: 'demopublickey', secret_key: 'demosecretkey') }
  let(:public_service) { described_class.new(public_key: 'demopublickey', secret_key: 'demosecretkey', public: true) }
  let(:uuid) { '2d33999d-c74a-4ff9-99ea-abc23496b052' }

  before do
    stub_const('ActiveStorage::Blob', Class.new)
    allow(ActiveStorage).to receive(:logger).and_return(Logger.new(nil))
    allow(ActiveStorage::Blob).to receive(:where).and_return(double(pluck: []))
    allow(ActiveStorage::Blob).to receive(:find_by).and_return(nil)
  end

  it 'owns a client instance' do
    expect(service.client).to be_a(Uploadcare::Client)
    expect(service.client.config.public_key).to eq('demopublickey')
  end

  it 'uploads a file via client.uploads.upload' do
    blob = double(metadata: {}, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)

    io = StringIO.new('test payload')
    checksum = Base64.strict_encode64(Digest::MD5.digest(io.read))
    io.rewind

    uploaded_file = double(uuid: uuid)
    expect(service.client.uploads).to receive(:upload).with(io, store: true, metadata: {}).and_return(uploaded_file)
    expect(blob).to receive(:update!).with(metadata: { 'uploadcare_uuid' => uuid })

    service.upload('blob-key', io, checksum: checksum)
  end

  it 'raises integrity error for invalid checksum' do
    io = StringIO.new('test payload')
    bad_checksum = Base64.strict_encode64(Digest::MD5.digest('different payload'))

    uploaded_file = double(uuid: uuid)
    allow(service.client.uploads).to receive(:upload).and_return(uploaded_file)

    expect { service.upload('blob-key', io, checksum: bad_checksum) }.to raise_error(ActiveStorage::IntegrityError)
  end

  it 'downloads file body for mapped key' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(service.client.files).to receive(:find).with(uuid: uuid)
                                                 .and_return(double(original_file_url: 'https://ucarecdn.com/file.bin', cdn_url: nil))
    allow(service).to receive(:request).with('https://ucarecdn.com/file.bin').and_return('file-body')

    expect(service.download('blob-key')).to eq('file-body')
  end

  it 'deletes a mapped file via client.files.batch_delete' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    expect(service.client.files).to receive(:batch_delete).with(uuids: [ uuid ])

    service.delete('blob-key')
  end

  it 'does not delete when mapping is missing' do
    expect(service.client.files).not_to receive(:batch_delete)

    service.delete('missing-key')
  end

  it 'returns nil when delete gets not found error' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(service.client.files).to receive(:batch_delete).and_raise(Uploadcare::Exception::NotFoundError)

    expect(service.delete('blob-key')).to be_nil
  end

  it 'deletes all keys with prefix' do
    allow(ActiveStorage::Blob).to receive(:where).with('key LIKE ?',
                                                       'prefix%').and_return(double(pluck: %w[prefix-1 prefix-2]))
    allow(service).to receive(:delete)

    service.delete_prefixed('prefix')

    expect(service).to have_received(:delete).with('prefix-1')
    expect(service).to have_received(:delete).with('prefix-2')
  end

  it 'supports existence check using mapped uuid' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(service.client.files).to receive(:find).with(uuid: uuid).and_return(double)

    expect(service.exist?('blob-key')).to eq(true)
  end

  it 'returns false from exist? when file is not found' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(service.client.files).to receive(:find).with(uuid: uuid).and_raise(Uploadcare::Exception::NotFoundError)

    expect(service.exist?('blob-key')).to eq(false)
  end

  it 'returns false from exist? when key is unknown' do
    expect(service.exist?('missing-key')).to eq(false)
  end

  it 'returns empty headers for direct upload' do
    expect(service.headers_for_direct_upload('key', checksum: 'x')).to eq({})
  end

  it 'raises for direct upload support' do
    expect do
      service.url_for_direct_upload('key', expires_in: 10, content_type: 'text/plain', content_length: 1, checksum: 'x')
    end
      .to raise_error(NotImplementedError)
  end

  it 'generates url using client.files.find' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(service.client.files).to receive(:find).with(uuid: uuid).and_return(double(cdn_url: 'https://ucarecdn.com/private'))

    expect(service.url('blob-key', expires_in: 60, filename: 'a.txt', disposition: :inline, content_type: 'text/plain'))
      .to eq('https://ucarecdn.com/private')
  end
end
