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

  it 'raises integrity error for invalid checksum' do
    io = StringIO.new('test payload')
    bad_checksum = Base64.strict_encode64(Digest::MD5.digest('different payload'))

    uploadcare_file = double(uuid: uuid)
    allow(Uploadcare::Uploader).to receive(:upload_file).and_return(uploadcare_file)

    expect { service.upload('blob-key', io, checksum: bad_checksum) }.to raise_error(ActiveStorage::IntegrityError)
  end

  it 'downloads file body for mapped key' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_return(double(original_file_url: 'https://ucarecdn.com/file.bin',
                                                                cdn_url: nil))
    allow(service).to receive(:request).with('https://ucarecdn.com/file.bin').and_return('file-body')

    expect(service.download('blob-key')).to eq('file-body')
  end

  it 'streams download when block is given' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_return(double(original_file_url: nil, cdn_url: 'https://ucarecdn.com/file.bin'))
    response = double
    allow(response).to receive(:read_body).and_yield('ab').and_yield('cd')
    allow(service).to receive(:request).with('https://ucarecdn.com/file.bin').and_yield(response)

    chunks = []
    service.download('blob-key') { |chunk| chunks << chunk }

    expect(chunks).to eq(%w[ab cd])
  end

  it 'raises file not found on download for missing blob mapping' do
    expect { service.download('missing-key') }.to raise_error(ActiveStorage::FileNotFoundError)
  end

  it 'raises file not found on download when uploadcare does not know uuid' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_raise(Uploadcare::Exception::NotFoundError)

    expect { service.download('blob-key') }.to raise_error(ActiveStorage::FileNotFoundError)
  end

  it 'downloads chunk with requested range' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_return(double(original_file_url: nil, cdn_url: 'https://ucarecdn.com/file.bin'))
    allow(service).to receive(:request).with('https://ucarecdn.com/file.bin', range: 0..3).and_return('data')

    expect(service.download_chunk('blob-key', 0..3)).to eq('data')
  end

  it 'raises file not found on download_chunk when uploadcare does not know uuid' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_raise(Uploadcare::Exception::NotFoundError)

    expect { service.download_chunk('blob-key', 0..3) }.to raise_error(ActiveStorage::FileNotFoundError)
  end

  it 'deletes a mapped file' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    uploadcare_file = double(delete: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    expect(Uploadcare::File).to receive(:new).with({ uuid: uuid },
                                                   kind_of(Uploadcare::Configuration)).and_return(uploadcare_file)

    service.delete('blob-key')
  end

  it 'does not delete when mapping is missing' do
    expect(Uploadcare::File).not_to receive(:new)

    service.delete('missing-key')
  end

  it 'returns nil when delete gets not found error' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    uploadcare_file = double
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:new).with({ uuid: uuid },
                                                  kind_of(Uploadcare::Configuration)).and_return(uploadcare_file)
    allow(uploadcare_file).to receive(:delete).and_raise(Uploadcare::Exception::NotFoundError)

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

  it 'escapes SQL wildcard characters in prefix when deleting prefixed keys' do
    relation = double(pluck: [])
    allow(ActiveStorage::Blob).to receive(:where).with('key LIKE ?',
                                                       'pre\%fix\_%').and_return(relation)

    service.delete_prefixed('pre%fix_')
  end

  it 'supports existence check using mapped uuid' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid,
                                                   config: kind_of(Uploadcare::Configuration)).and_return(double)

    expect(service.exist?('blob-key')).to eq(true)
  end

  it 'returns false from exist? when file is not found in uploadcare' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_raise(Uploadcare::Exception::NotFoundError)

    expect(service.exist?('blob-key')).to eq(false)
  end

  it 'returns false from exist? when key is unknown' do
    expect(service.exist?('missing-key')).to eq(false)
  end

  it 'uses instrumentation payload for exist? true path' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid,
                                                   config: kind_of(Uploadcare::Configuration)).and_return(double)

    payload = {}
    expect(service).to receive(:instrument).with(:exist, key: 'blob-key').and_yield(payload)

    expect(service.exist?('blob-key')).to eq(true)
    expect(payload[:exist]).to eq(true)
  end

  it 'uses instrumentation payload for exist? false path' do
    payload = {}
    expect(service).to receive(:instrument).with(:exist, key: 'missing-key').and_yield(payload)

    expect(service.exist?('missing-key')).to eq(false)
    expect(payload[:exist]).to eq(false)
  end

  it 'uses uuid key directly when key is a uuid' do
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid,
                                                   config: kind_of(Uploadcare::Configuration)).and_return(double)

    expect(service.exist?(uuid)).to eq(true)
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

  it 'generates url for private service' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    file = double(cdn_url: 'https://ucarecdn.com/private')
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:new).with({ uuid: uuid }, kind_of(Uploadcare::Configuration)).and_return(file)

    expect(service.url('blob-key', expires_in: 60, filename: 'a.txt', disposition: :inline, content_type: 'text/plain'))
      .to eq('https://ucarecdn.com/private')
  end

  it 'generates url for public service' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid })
    file = double(cdn_url: 'https://ucarecdn.com/public')
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:new).with({ uuid: uuid }, kind_of(Uploadcare::Configuration)).and_return(file)

    expect(public_service.url('blob-key', expires_in: 60, filename: 'a.txt', disposition: :inline,
                                          content_type: 'text/plain'))
      .to eq('https://ucarecdn.com/public')
  end

  it 'uses blob metadata mapping for download after upload mapping persisted' do
    blob = double(metadata: { 'uploadcare_uuid' => uuid }, update!: true)
    allow(ActiveStorage::Blob).to receive(:find_by).with(key: 'blob-key').and_return(blob)
    allow(Uploadcare::File).to receive(:info).with(uuid: uuid, config: kind_of(Uploadcare::Configuration))
                                             .and_return(double(original_file_url: 'https://ucarecdn.com/file.bin',
                                                                cdn_url: nil))
    allow(service).to receive(:request).with('https://ucarecdn.com/file.bin').and_return('file-body')

    expect(service.download('blob-key')).to eq('file-body')
  end
end
