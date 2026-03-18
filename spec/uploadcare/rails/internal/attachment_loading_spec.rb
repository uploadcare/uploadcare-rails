# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/internal/attachment_loading'

RSpec.describe Uploadcare::Rails::Internal::AttachmentLoading do
  let(:config) { OpenStruct.new(cache_files: false, cache_expires_in: 60, cache_namespace: nil) }

  let(:klass) do
    Class.new do
      include Uploadcare::Rails::Internal::AttachmentLoading

      attr_accessor :name, :cdn_url

      def initialize(name: nil, cdn_url: nil)
        @name = name
        @cdn_url = cdn_url
      end
    end
  end
  let(:instance) { klass.new }

  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(config)
  end

  describe '#update_attrs' do
    it 'returns self when attrs are nil' do
      expect(instance.update_attrs(nil)).to eq(instance)
    end

    it 'raises for non-hash attrs' do
      expect { instance.update_attrs('name') }.to raise_error(ArgumentError, 'new_attrs must be a Hash')
    end

    it 'assigns known attributes from hash' do
      instance.update_attrs('name' => 'Uploadcare')

      expect(instance.name).to eq('Uploadcare')
    end

    it 'ignores unknown attributes' do
      expect { instance.update_attrs('unknown' => 'value') }.not_to raise_error
    end
  end

  describe '#caching_enabled?' do
    it 'returns false when cache_files is falsy' do
      expect(instance.caching_enabled?).to eq(false)
    end

    it 'returns true when cache_files is truthy' do
      allow(config).to receive(:cache_files).and_return(true)

      expect(instance.caching_enabled?).to eq(true)
    end
  end
end
