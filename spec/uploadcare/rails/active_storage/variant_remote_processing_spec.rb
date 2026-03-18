# frozen_string_literal: true

require 'spec_helper'
require 'active_storage/errors'
require 'active_storage/service/uploadcare_service'
require 'uploadcare/rails/active_storage/variant_remote_processing'

RSpec.describe Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing do
  let(:service) do
    ActiveStorage::Service::UploadcareService.new(
      public_key: 'demopublickey',
      secret_key: 'demosecretkey'
    )
  end
  let(:uuid) { '2d33999d-c74a-4ff9-99ea-abc23496b052' }

  let(:variant_host_class) do
    Class.new do
      prepend Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing

      attr_reader :service, :blob, :variation

      def initialize(service:, blob:, variation:)
        @service = service
        @blob = blob
        @variation = variation
      end

      def key
        'variant-key'
      end

      def content_type
        'image/png'
      end

      def process
        :base_process_called
      end
    end
  end

  let(:blob) { double(metadata: { 'uploadcare_uuid' => uuid }, key: 'blob-key', service: service) }
  let(:variation) { double(format: 'png', transformations: { resize_to_limit: [ 320, 320 ], quality: 'smart' }) }

  it 'downloads transformed image from uploadcare and uploads variant to service' do
    host = variant_host_class.new(service: service, blob: blob, variation: variation)

    allow(service).to receive(:upload)
    allow(service).to receive(:uuid_for).with('blob-key').and_return(uuid)
    allow(service.client.files).to receive(:find).with(uuid: uuid)
                                                 .and_return(double(cdn_url: "https://ucarecdn.com/#{uuid}/"))

    response = Net::HTTPOK.new('1.1', '200', 'OK')
    allow(response).to receive(:body).and_return('transformed-bytes')
    allow(host).to receive(:http_get).and_return(response)

    host.send(:process)

    expect(service).to have_received(:upload).with('variant-key', anything, content_type: 'image/png')
  end

  it 'resolves the uploadcare uuid through the service mapping' do
    mapped_blob = double(metadata: {}, key: 'mapped-key', service: service)
    host = variant_host_class.new(service: service, blob: mapped_blob, variation: variation)

    allow(service).to receive(:uuid_for).with('mapped-key').and_return(uuid)
    allow(service.client.files).to receive(:find).with(uuid: uuid)
                                                 .and_return(double(cdn_url: "https://ucarecdn.com/#{uuid}/"))

    host.send(:variant_source_url)

    expect(service).to have_received(:uuid_for).with('mapped-key').at_least(:once)
  end

  it 'maps resize_to_fill into uploadcare scale_crop operation' do
    fill_variation = double(format: 'png', transformations: { resize_to_fill: [ 200, 100 ] })
    host = variant_host_class.new(service: service, blob: blob, variation: fill_variation)

    mapped = host.send(:uploadcare_transformations)

    expect(mapped[:scale_crop]).to eq({ dimensions: '200x100', offsets: '50%,50%' })
  end

  it 'maps resize_to_fit into uploadcare resize operation' do
    fit_variation = double(format: 'png', transformations: { resize_to_fit: [ 640, 480 ] })
    host = variant_host_class.new(service: service, blob: blob, variation: fit_variation)

    mapped = host.send(:uploadcare_transformations)

    expect(mapped[:resize]).to eq('640x480')
  end

  it 'falls back to base process when service is not uploadcare service' do
    non_uploadcare_service = Object.new
    host = variant_host_class.new(service: non_uploadcare_service, blob: blob, variation: variation)

    expect(host.send(:process)).to eq(:base_process_called)
  end

  it 'resolves relative redirect locations' do
    host = variant_host_class.new(service: service, blob: blob, variation: variation)
    redirect = Net::HTTPFound.new('1.1', '302', 'Found')
    success = Net::HTTPOK.new('1.1', '200', 'OK')
    calls = 0

    allow(redirect).to receive(:[]).with('location').and_return('/variant/final.png')
    allow(Net::HTTP).to receive(:start) do |_, _, use_ssl:, &block|
      calls += 1
      expect(use_ssl).to eq(true)

      http = double
      allow(http).to receive(:request).and_return(calls == 1 ? redirect : success)
      block.call(http)
    end

    expect(host.send(:http_get, "https://ucarecdn.com/#{uuid}/-/resize/100x100/")).to eq(success)
  end

  it 'wraps write timeouts as integrity errors' do
    host = variant_host_class.new(service: service, blob: blob, variation: variation)

    allow(Net::HTTP).to receive(:start).and_raise(Net::WriteTimeout)

    expect do
      host.send(:http_get, "https://ucarecdn.com/#{uuid}/-/resize/100x100/")
    end.to raise_error(ActiveStorage::IntegrityError, /Net::WriteTimeout/)
  end
end
