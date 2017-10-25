require 'yaml'
require_relative '../support/generators'
require 'generators/uploadcare_config_generator'

RSpec.describe UploadcareConfigGenerator, :type => :generator do
  destination File.expand_path('../tmp', __dir__)
  let(:config_file_path) { 'spec/tmp/config/uploadcare.yml' }
  let(:defaults) do
    {
      "public_key"=>"demopublickey",
      "private_key"=>"demoprivatekey",
      "live"=>true, "cache_files"=>true,
      "cache_groups"=>true,
      "store_after_save"=>true,
      "delete_after_destroy"=>true,
    }
  end

  before do
    prepare_destination
    expect(File.exists?(config_file_path)).to be(false)
    run_generator
  end

  it "generates config/uploadcare.yml" do
    expect(File.exists?(config_file_path)).to be(true)
  end

  it "config/uploadcare.yml contains default config" do
    expect(YAML.load_file(config_file_path)).to eq(
      "defaults" => defaults,
      "development" => defaults,
      "production" => defaults,
      "test" => defaults,
    )
  end
end


