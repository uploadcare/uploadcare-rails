# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Uploadcare::Rails::Configuration do
  describe '#initialize' do
    it 'applies known keys' do
      config = described_class.new(public_key: 'pk', secret_key: 'sk')

      expect(config.public_key).to eq('pk')
      expect(config.secret_key).to eq('sk')
    end

    it 'warns when unknown keys are provided' do
      logger = double('logger')
      allow(logger).to receive(:warn)
      allow(Rails).to receive(:logger).and_return(logger)

      described_class.new(public_key: 'pk', unknown_setting: 'value')

      expect(logger).to have_received(:warn).with(/unknown_setting/)
    end
  end
end
