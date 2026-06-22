# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Uploadcare::Rails::Engine do
  describe 'configuration loading' do
    let(:target) { ActiveSupport::OrderedOptions.new }

    it 'ignores missing environment settings from config_for' do
      expect do
        described_class.instance.send(:merge_uploadcare_settings!, target, nil)
      end.not_to raise_error

      expect(target.to_h).to eq({})
    end

    it 'merges environment settings into the Rails config' do
      described_class.instance.send(
        :merge_uploadcare_settings!,
        target,
        { public_key: 'public', secret_key: 'secret' }
      )

      expect(target.public_key).to eq('public')
      expect(target.secret_key).to eq('secret')
    end
  end
end
