# frozen_string_literal: true

require 'spec_helper'
require 'stringio'
require 'logger'
require 'base64'
require 'digest'
require 'active_storage/service/uploadcare_service'

RSpec.describe ActiveStorage::Service::UploadcareService do
  let(:service) { described_class.new(public_key: 'demopublickey', secret_key: 'demosecretkey') }
  let(:uuid) { '2d33999d-c74a-4ff9-99ea-abc23496b052' }

  before do
    stub_const('ActiveStorage::Blob', Class.new)
    allow(ActiveStorage).to receive(:logger).and_return(Logger.new(nil))
    allow(ActiveStorage::Blob).to receive(:where).and_return(double(pluck: []))
  end

  it 'uploads a file and persists uploadcare uuid into blob metadata' do
    blob = double(metadata: {}, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)

    io = StringIO.new('test payload')
    checksum = Base64.strict_encode64(Digest::MD5.digest(io.read))
    io.rewind

    uploadcare_file = double(uuid: uuid)
    expect(Uploadcare::Uploader).to receive(:upload_file).and_return(uploadcare_file)
    expect(blob).to receive(:update!).with(metadata: { 'uploadcare_uuid' => uuid })

    service.upload('blob-key', io, checksum: checksum)
  end

  it 'supports existence check using mapped uuid' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration)).and_return(double)

    expect(service.exist?('blob-key')).to eq(true)
  end

  it 'raises for direct upload support' do
    expect { service.url_for_direct_upload('key', expires_in: 10, content_type: 'text/plain', content_length: 1, checksum: 'x') }
      .to raise_error(NotImplementedError)
  end
end
