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

  let(:blob) { double(metadata: { 'uploadcare_uuid' => uuid }, key: 'blob-key') }
  let(:variation) { double(format: 'png', transformations: { resize_to_limit: [320, 320], quality: 'smart' }) }

  it 'downloads transformed image from uploadcare and uploads variant to service' do
    host = variant_host_class.new(service: service, blob: blob, variation: variation)

    allow(service).to receive(:upload)

    file = instance_double(Uploadcare::Rails::File)
    allow(Uploadcare::Rails::File).to receive(:new).with({ uuid: uuid }).and_return(file)
    allow(file).to receive(:transform_url).with(hash_including(resize: '320x320', quality: 'smart')).and_return("https://ucarecdn.com/#{uuid}/-/resize/320x320/-/quality/smart/")

    response = Net::HTTPOK.new('1.1', '200', 'OK')
    allow(response).to receive(:body).and_return('transformed-bytes')
    allow(host).to receive(:http_get).and_return(response)

    host.send(:process)

    expect(service).to have_received(:upload).with('variant-key', anything, content_type: 'image/png')
  end

  it 'maps resize_to_fill into uploadcare scale_crop operation' do
    fill_variation = double(format: 'png', transformations: { resize_to_fill: [200, 100] })
    host = variant_host_class.new(service: service, blob: blob, variation: fill_variation)

    mapped = host.send(:uploadcare_transformations)

    expect(mapped[:scale_crop]).to eq({ dimensions: '200x100', offsets: '50%,50%' })
  end

  it 'maps resize_to_fit into uploadcare resize operation' do
    fit_variation = double(format: 'png', transformations: { resize_to_fit: [640, 480] })
    host = variant_host_class.new(service: service, blob: blob, variation: fit_variation)

    mapped = host.send(:uploadcare_transformations)

    expect(mapped[:resize]).to eq('640x480')
  end

  it 'falls back to base process when service is not uploadcare service' do
    non_uploadcare_service = Object.new
    host = variant_host_class.new(service: non_uploadcare_service, blob: blob, variation: variation)

    expect(host.send(:process)).to eq(:base_process_called)
  end
end
