require 'spec_helper'

describe Uploadcare::Rails::Settings do
  subject(:settings) { described_class.new(test: config) }

  let(:full_config) do
    {
      widget_version: '3.x',
      upload_url_base: 'http://example.com/',
      api_url_base: 'http://example.com/',
      static_url_base: 'http://example.com/',
      api_version: '0.3',
      public_key: 'test_public_key',
      private_key: 'test_private_key',
      auth_scheme: :secure,
      cache_files: true,
      cache_groups: true,
      delete_after_destroy: true,
      store_after_save: true,
      locale: 'en',
      images_only: true,
      multiple: true,
      multiple_min: 2,
      multiple_max: 3,
      preview_step: true,
      crop: true,
      clearable: true,
      tabs: "url file facebook",
      autostore: true,
      live: true,
      manual_start: true,
      path_value: true,
    }
  end
  let(:config) { full_config }

  it { is_expected.to respond_to(:widget_version) }
  it { is_expected.to respond_to(:upload_url_base) }
  it { is_expected.to respond_to(:api_url_base) }
  it { is_expected.to respond_to(:static_url_base) }
  it { is_expected.to respond_to(:api_version) }
  it { is_expected.to respond_to(:cache_files) }
  it { is_expected.to respond_to(:cache_groups) }
  it { is_expected.to respond_to(:public_key) }
  it { is_expected.to respond_to(:private_key) }
  it { is_expected.to respond_to(:auth_scheme) }
  it { is_expected.to respond_to(:delete_after_destroy) }
  it { is_expected.to respond_to(:store_after_save) }
  it { is_expected.to respond_to(:locale) }
  it { is_expected.to respond_to(:images_only) }
  it { is_expected.to respond_to(:multiple) }
  it { is_expected.to respond_to(:multiple_min) }
  it { is_expected.to respond_to(:multiple_max) }
  it { is_expected.to respond_to(:preview_step) }
  it { is_expected.to respond_to(:crop) }
  it { is_expected.to respond_to(:clearable) }
  it { is_expected.to respond_to(:tabs) }
  it { is_expected.to respond_to(:autostore) }
  it { is_expected.to respond_to(:live) }
  it { is_expected.to respond_to(:manual_start) }
  it { is_expected.to respond_to(:path_value) }

  it { is_expected.to have_attributes(full_config) }

  it { is_expected.to respond_to(:api) }
  it { expect(settings.api).to be_a(Uploadcare::Api) }

  it { is_expected.to respond_to(:api_settings) }
  it { expect(settings.api_settings).to eq(settings.to_h) }

  it { is_expected.to respond_to(:widget_settings) }
  it 'filters private settings' do
    expect(settings.widget_settings).to eq(
      public_key: "test_public_key",
      locale: 'en',
      images_only: true,
      multiple: true,
      multiple_min: 2,
      multiple_max: 3,
      preview_step: true,
      crop: true,
      clearable: true,
      tabs: "url file facebook",
      autostore: true,
      live: true,
      manual_start: true,
      path_value: true,
    )
  end

  context 'when no config for the current rails env given' do
    subject(:settings) { described_class.new(development: config) }
    it { expect { settings }.to raise_error(ArgumentError) }
  end

  context 'works with both symbols and strings in a config' do
    subject(:settings) { described_class.new('test' => config.stringify_keys) }
    it { is_expected.to have_attributes(full_config) }
  end

  context 'when some settings are missing in the config' do
    context 'if missing settings are some of uploadcare-ruby defaults' do
      let(:uploadcare_ruby_defaults) do
        Uploadcare::DEFAULT_SETTINGS.except(:public_key, :private_key)
      end
      let(:config) { full_config.except(*uploadcare_ruby_defaults.keys) }

      it 'sets missing settings from uploadcare-ruby defaults' do
        uploadcare_ruby_defaults.each do |k, v|
          expect(settings).to have_attributes(k => v)
        end
      end
    end

    context 'if public key is missing' do
      let(:config) { full_config.except(:public_key) }
      it { expect { settings }.to raise_error(ArgumentError) }
    end

    context 'if private key is missing' do
      let(:config) { full_config.except(:private_key) }
      it { expect { settings }.to raise_error(ArgumentError) }
    end

    context 'if missing settings are some of uploadcare-rails defaults' do
      let(:uploadcare_rails_defaults) { Uploadcare::Rails::DEFAULT_SETTINGS }
      let(:config) { full_config.except(uploadcare_rails_defaults.keys) }

      it 'sets missing settings from uploadcare-rails defaults' do
        uploadcare_rails_defaults.each do |k, v|
          expect(settings).to have_attributes(k => v)
        end
      end
    end
  end
end
