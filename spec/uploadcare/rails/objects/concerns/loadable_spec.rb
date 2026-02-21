# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/objects/concerns/loadable'

RSpec.describe Uploadcare::Rails::Objects::Loadable do
  let(:klass) do
    Class.new do
      include Uploadcare::Rails::Objects::Loadable

      attr_accessor :name

      def self.uploadcare_configuration
        Struct.new(:cache_namespace, :cache_expires_in, :cache_files).new(nil, 1.minute, false)
      end
    end
  end
  let(:instance) { klass.new }

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
  end
end
