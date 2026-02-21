# frozen_string_literal: true

require 'uploadcare-rails'

RSpec.describe Uploadcare::Rails do
  let(:config_options) { { public_key: 'pk', secret_key: 'sk', framework_data: 'rails' } }

  it 'has a version number' do
    expect(Uploadcare::Rails::VERSION).not_to be nil
  end

  it 'overwrites ruby config' do
    Uploadcare::Rails.configure do |config|
      config.public_key = 'rails_public_key'
      config.secret_key = 'rails_secret_key'
    end

    expect(Uploadcare.configuration.public_key).to eq 'rails_public_key'
    expect(Uploadcare.configuration.secret_key).to eq 'rails_secret_key'
  end

  it 'builds a standalone client config' do
    client_config = described_class.client_config(**config_options)

    expect(client_config).to be_a(Uploadcare::Configuration)
    expect(client_config.public_key).to eq('pk')
    expect(client_config.secret_key).to eq('sk')
  end

  it 'serializes known client config attributes' do
    serialized = described_class.serialize_client_config(described_class.client_config(**config_options))

    expect(serialized[:public_key]).to eq('pk')
    expect(serialized[:secret_key]).to eq('sk')
    expect(serialized[:framework_data]).to eq('rails')
  end

  it 'returns empty hash when serializing nil config' do
    expect(described_class.serialize_client_config(nil)).to eq({})
  end

  it 'returns global config when build_client_config gets blank config options' do
    expect(described_class.build_client_config({})).to equal(Uploadcare.configuration)
  end

  it 'builds config from string-key options' do
    config = described_class.build_client_config('public_key' => 'other_pk', 'secret_key' => 'other_sk')

    expect(config).to be_a(Uploadcare::Configuration)
    expect(config.public_key).to eq('other_pk')
    expect(config.secret_key).to eq('other_sk')
  end
end
