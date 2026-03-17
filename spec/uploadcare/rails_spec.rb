# frozen_string_literal: true

require 'uploadcare-rails'

RSpec.describe Uploadcare::Rails do
  after { described_class.reset_default_client! }

  it 'has a version number' do
    expect(Uploadcare::Rails::VERSION).not_to be nil
  end

  it 'syncs SDK configuration on configure' do
    Uploadcare::Rails.configure do |config|
      config.public_key = 'rails_public_key'
      config.secret_key = 'rails_secret_key'
    end

    expect(Uploadcare.configuration.public_key).to eq 'rails_public_key'
    expect(Uploadcare.configuration.secret_key).to eq 'rails_secret_key'
  end

  it 'resets the default client and syncs SDK configuration when configuration is reassigned' do
    Uploadcare::Rails.configure do |config|
      config.public_key = 'default_pk'
      config.secret_key = 'default_sk'
    end

    initial_client = described_class.client

    described_class.configuration = Uploadcare::Rails::Configuration.new(
      public_key: 'new_pk',
      secret_key: 'new_sk'
    )

    updated_client = described_class.client

    expect(updated_client).not_to equal(initial_client)
    expect(updated_client.config.public_key).to eq('new_pk')
    expect(Uploadcare.configuration.public_key).to eq('new_pk')
    expect(Uploadcare.configuration.secret_key).to eq('new_sk')
  end

  describe '.client' do
    before do
      Uploadcare::Rails.configure do |config|
        config.public_key = 'default_pk'
        config.secret_key = 'default_sk'
      end
    end

    it 'returns a default client using configured keys' do
      client = described_class.client

      expect(client).to be_a(Uploadcare::Client)
      expect(client.config.public_key).to eq('default_pk')
      expect(client.config.secret_key).to eq('default_sk')
    end

    it 'returns the same default client on repeated calls' do
      expect(described_class.client).to equal(described_class.client)
    end

    it 'builds a new client when overrides are given' do
      client = described_class.client(public_key: 'other_pk', secret_key: 'other_sk')

      expect(client).to be_a(Uploadcare::Client)
      expect(client.config.public_key).to eq('other_pk')
      expect(client.config.secret_key).to eq('other_sk')
      expect(client).not_to equal(described_class.client)
    end
  end

  describe '.resolve_client' do
    before do
      Uploadcare::Rails.configure do |config|
        config.public_key = 'default_pk'
        config.secret_key = 'default_sk'
      end
    end

    it 'returns a client instance as-is' do
      client = Uploadcare::Client.new(public_key: 'pk', secret_key: 'sk')

      expect(described_class.resolve_client(client)).to equal(client)
    end

    it 'builds a client from a hash' do
      client = described_class.resolve_client({ public_key: 'hash_pk', secret_key: 'hash_sk' })

      expect(client).to be_a(Uploadcare::Client)
      expect(client.config.public_key).to eq('hash_pk')
    end

    it 'returns default client for nil' do
      expect(described_class.resolve_client(nil)).to equal(described_class.client)
    end
  end

  describe '.serialize_client_options' do
    it 'returns hash from client config' do
      client = Uploadcare::Client.new(public_key: 'pk', secret_key: 'sk')
      serialized = described_class.serialize_client_options(client)

      expect(serialized).to be_a(Hash)
      expect(serialized[:public_key]).to eq('pk')
      expect(serialized[:secret_key]).to eq('sk')
    end

    it 'returns empty hash for nil' do
      expect(described_class.serialize_client_options(nil)).to eq({})
    end
  end

  describe '.build_client_from_options' do
    before do
      Uploadcare::Rails.configure do |config|
        config.public_key = 'default_pk'
        config.secret_key = 'default_sk'
      end
    end

    it 'returns default client for blank options' do
      expect(described_class.build_client_from_options({})).to equal(described_class.client)
    end

    it 'builds client from provided options' do
      client = described_class.build_client_from_options(public_key: 'other_pk', secret_key: 'other_sk')

      expect(client).to be_a(Uploadcare::Client)
      expect(client.config.public_key).to eq('other_pk')
    end
  end
end
