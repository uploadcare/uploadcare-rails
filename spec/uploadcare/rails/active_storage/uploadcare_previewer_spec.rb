# frozen_string_literal: true

require 'spec_helper'
require 'active_storage/errors'
require 'active_storage/service/uploadcare_service'
require 'uploadcare/rails/active_storage/uploadcare_previewer'

RSpec.describe Uploadcare::Rails::ActiveStorage::UploadcarePreviewer do
  let(:service) { ActiveStorage::Service::UploadcareService.new(public_key: 'demopublickey', secret_key: 'demosecretkey') }
  let(:uuid) { '2d33999d-c74a-4ff9-99ea-abc23496b052' }
  let(:filename) { double(base: 'report') }
  let(:blob) do
    double(
      service: service,
      content_type: 'application/pdf',
      metadata: { 'uploadcare_uuid' => uuid },
      key: 'fallback-key',
      filename: filename
    )
  end

  describe '.accept?' do
    it 'accepts uploadcare-backed pdf blobs' do
      expect(described_class.accept?(blob)).to eq(true)
    end

    it 'rejects non-pdf blobs' do
      image_blob = double(service: service, content_type: 'image/png')
      expect(described_class.accept?(image_blob)).to eq(false)
    end
  end

  describe '#preview' do
    it 'yields png preview attachable payload' do
      previewer = described_class.new(blob)
      allow(Uploadcare::FileApi).to receive(:get_file).with(uuid).and_return(double(cdn_url: "https://ucarecdn.com/#{uuid}/"))

      response = Net::HTTPOK.new('1.1', '200', 'OK')
      allow(response).to receive(:body).and_return('png-preview-data')
      allow(previewer).to receive(:http_get).and_return(response)

      yielded = nil
      previewer.preview do |attachable|
        yielded = attachable
        expect(attachable[:io].read).to eq('png-preview-data')
      end

      expect(yielded[:filename].to_s).to eq('report.png')
      expect(yielded[:content_type]).to eq('image/png')
    end
  end
end
