# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/services/id_extractor'

describe Uploadcare::Rails::IdExtractor, type: :service do
  subject { described_class.call(cdn_url, regex) }

  let(:uuid) { 'a5c4b078-39ec-424d-8a51-1eb15c673e49' }

  context 'when extracting a UUID from a cdn_urls' do
    let(:regex) { /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/ }

    [
      'https://ucarecdn.com/:uuid/',
      "https://ucarecdn.com/:uuid/-/overlay/#{SecureRandom.uuid}/",
      "https://ucarecdn.com/:uuid/image-#{SecureRandom.uuid}.jpg"
    ].each do |masked_url|
      let(:cdn_url) { masked_url.gsub(':uuid', uuid) }

      it "extracts an UUID from the cdn_url - #{masked_url}" do
        expect(subject).to eq uuid
      end
    end
  end
end
