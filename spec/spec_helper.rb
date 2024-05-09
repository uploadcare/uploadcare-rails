# frozen_string_literal: true

require 'rspec'
require 'bundler/setup'
require 'uploadcare/rails'
require 'dry/monads/all'
require 'api_struct'
require 'uploadcare'
require 'action_view'
require 'ostruct'
require_relative 'support/stub_config_keys'

Dir[File.expand_path(File.join(File.dirname(__FILE__), 'support', '**', '*.rb'))].sort.each { |f| require f }

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = '.rspec_status'

  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!

  config.expose_dsl_globally = true

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  config.include ActionView::Helpers, type: :helper

  # Stub config keys for specs in the following directories
  # spec/uploadcare/rails/api, spec/uploadcare/rails/objects
  #
  # Add metadata for the directories
  # (Ref: https://www.rubydoc.info/gems/rspec-core/RSpec%2FCore%2FConfiguration:define_derived_metadata)
  config.define_derived_metadata(file_path: %r{/spec/uploadcare/rails/api|objects/}) do |metadata|
    metadata[:type] = :stub_config_keys
  end

  # Use the metadata to include the mod only for the specs from the directories
  # (Ref: https://www.rubydoc.info/gems/rspec-core/RSpec%2FCore%2FConfiguration:include)
  config.include StubConfigKeys, type: :stub_config_keys
  # End stub config keys for specs
end
