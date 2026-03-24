# frozen_string_literal: true

require 'spec_helper'
require 'active_storage/errors'
require 'active_storage/service/uploadcare_service'
require 'uploadcare/rails/active_storage/uploadcare_previewer'

RSpec.describe Uploadcare::Rails::ActiveStorage::UploadcarePreviewer do
  let(:service) do
    ActiveStorage::Service::UploadcareService.new(
      public_key: 'demopublickey',
      secret_key: 'demosecretkey'
    )
  end
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
    it 'yields png preview attachable payload using service client' do
      previewer = described_class.new(blob)
      allow(service).to receive(:uuid_for).with('fallback-key').and_return(uuid)
      allow(service.client.files).to receive(:find).with(uuid: uuid)
                                                   .and_return(double(cdn_url: "https://ucarecdn.com/#{uuid}/"))

      response = Net::HTTPOK.new('1.1', '200', 'OK')
      allow(response).to receive(:body).and_return('png-preview-data')
      allow(previewer).to receive(:fetch_http_response).and_return(response)

      yielded = nil
      previewer.preview do |attachable|
        yielded = attachable
        expect(attachable[:io].read).to eq('png-preview-data')
      end

      expect(yielded[:filename].to_s).to eq('report.png')
      expect(yielded[:content_type]).to eq('image/png')
    end

    it 'resolves the uploadcare uuid through the service mapping' do
      mapped_blob = double(
        service: service,
        content_type: 'application/pdf',
        metadata: {},
        key: 'mapped-key',
        filename: filename
      )
      previewer = described_class.new(mapped_blob)

      allow(service).to receive(:uuid_for).with('mapped-key').and_return(uuid)
      allow(service.client.files).to receive(:find).with(uuid: uuid)
                                                   .and_return(double(cdn_url: "https://ucarecdn.com/#{uuid}/"))

      response = Net::HTTPOK.new('1.1', '200', 'OK')
      allow(response).to receive(:body).and_return('png-preview-data')
      allow(previewer).to receive(:fetch_http_response).and_return(response)

      previewer.preview { |_| }

      expect(service).to have_received(:uuid_for).with('mapped-key')
    end

    it 'resolves relative redirect locations' do
      previewer = described_class.new(blob)
      redirect = Net::HTTPFound.new('1.1', '302', 'Found')
      success = Net::HTTPOK.new('1.1', '200', 'OK')
      calls = 0

      allow(redirect).to receive(:[]).with('location').and_return('/preview/final.png')
      allow(Net::HTTP).to receive(:start) do |_, _, use_ssl:, &block|
        calls += 1
        expect(use_ssl).to eq(true)

        http = double
        allow(http).to receive(:request).and_return(calls == 1 ? redirect : success)
        block.call(http)
      end

      expect(
        previewer.send(
          :fetch_http_response,
          "https://ucarecdn.com/#{uuid}/-/preview/",
          limit: 5,
          error_class: ActiveStorage::PreviewError,
          label: "preview"
        )
      ).to eq(success)
    end

    it 'rejects redirects to untrusted hosts' do
      previewer = described_class.new(blob)
      redirect = Net::HTTPFound.new('1.1', '302', 'Found')

      allow(redirect).to receive(:[]).with('location').and_return('https://example.com/final.png')
      allow(Net::HTTP).to receive(:start) do |_, _, use_ssl:, &block|
        expect(use_ssl).to eq(true)

        http = double
        allow(http).to receive(:request).and_return(redirect)
        block.call(http)
      end

      expect do
        previewer.send(
          :fetch_http_response,
          "https://ucarecdn.com/#{uuid}/-/preview/",
          limit: 5,
          error_class: ActiveStorage::PreviewError,
          label: "preview"
        )
      end.to raise_error(ActiveStorage::PreviewError, /not trusted/)
    end

    it 'accepts redirects to trusted custom uploadcare hosts' do
      previewer = described_class.new(blob)
      redirect = Net::HTTPFound.new('1.1', '302', 'Found')
      success = Net::HTTPOK.new('1.1', '200', 'OK')
      calls = 0

      allow(service.client.config).to receive(:default_cdn_base).and_return('https://files.example-cdn.test/')
      allow(redirect).to receive(:[]).with('location').and_return('https://files.example-cdn.test/final.png')
      allow(Net::HTTP).to receive(:start) do |_, _, use_ssl:, &block|
        calls += 1
        expect(use_ssl).to eq(true)

        http = double
        allow(http).to receive(:open_timeout=)
        allow(http).to receive(:read_timeout=)
        allow(http).to receive(:write_timeout=)
        allow(http).to receive(:request).and_return(calls == 1 ? redirect : success)
        block.call(http)
      end

      expect(
        previewer.send(
          :fetch_http_response,
          "https://ucarecdn.com/#{uuid}/-/preview/",
          limit: 5,
          error_class: ActiveStorage::PreviewError,
          label: "preview"
        )
      ).to eq(success)
    end
  end
end
