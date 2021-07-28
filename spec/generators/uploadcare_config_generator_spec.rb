# frozen_string_literal: true

require_relative '../support/generators'
require 'generators/uploadcare_config_generator'

RSpec.describe UploadcareConfigGenerator, type: :generator do
  destination File.expand_path('../tmp', __dir__)

  let(:config_file_path) { 'spec/tmp/config/initializers/uploadcare.rb' }

  before do
    prepare_destination
  end

  it 'checks that no config exists before the generator run' do
    expect(File.exist?(config_file_path)).to be(false)
  end

  context 'when run the generator' do
    before { run_generator }

    it 'generates the config file' do
      run_generator
      expect(File.exist?(config_file_path)).to be(true)
    end

    it 'checks that the config file contains the :configure method call' do
      expect(File.open(config_file_path).read).to match(/Uploadcare::Rails.configure do |config|/)
    end
  end
end
