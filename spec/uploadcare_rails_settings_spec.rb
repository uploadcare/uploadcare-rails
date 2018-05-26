require 'spec_helper'

describe Uploadcare::Rails do
  it "should load settings" do
    UPLOADCARE_SETTINGS.should_not be_nil
    UPLOADCARE_SETTINGS.should be_kind_of(Uploadcare::Rails::Settings)
  end

  it "settings should respond to all defined methods" do
    UPLOADCARE_SETTINGS.should respond_to(:widget_version)
    UPLOADCARE_SETTINGS.should respond_to(:upload_url_base)
    UPLOADCARE_SETTINGS.should respond_to(:api_url_base)
    UPLOADCARE_SETTINGS.should respond_to(:static_url_base)
    UPLOADCARE_SETTINGS.should respond_to(:api_version)
    UPLOADCARE_SETTINGS.should respond_to(:cache_files)
    UPLOADCARE_SETTINGS.should respond_to(:public_key)
    UPLOADCARE_SETTINGS.should respond_to(:private_key)
  end

  it "should have private and public keys as not empty strings" do
    UPLOADCARE_SETTINGS.private_key.should be_kind_of(String)
    UPLOADCARE_SETTINGS.public_key.should be_kind_of(String)

    UPLOADCARE_SETTINGS.private_key.should_not be_empty
    UPLOADCARE_SETTINGS.public_key.should_not be_empty
  end

  it "pub and private keys should be loaded from config file" do
    config_file = "#{Rails.root}/config/uploadcare.yml"
    config = YAML.load_file(config_file)

    UPLOADCARE_SETTINGS.private_key.should == config["test"]["private_key"]
    UPLOADCARE_SETTINGS.public_key.should == config["test"]["public_key"]
  end

  # TODO: test api settings and widget settings
  it "should build instanse of UC api" do
    UPLOADCARE_SETTINGS.api.should be_kind_of(Uploadcare::Api)
  end

  it "should build api settings hash" do
    UPLOADCARE_SETTINGS.api_settings.should be_a_kind_of(Hash)
    UPLOADCARE_SETTINGS.api_settings.should_not be_empty
  end

  it "should build widget settings hash" do
    UPLOADCARE_SETTINGS.widget_settings.should be_a_kind_of(Hash)
    UPLOADCARE_SETTINGS.widget_settings.should_not be_empty
  end

  it 'should include user agent environment config' do
    expect(UPLOADCARE_SETTINGS.user_agent_environment.keys).to include(
      :framework_name, :framework_version, :extension_name, :extension_version
    )
  end
end
