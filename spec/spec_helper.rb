# frozen_string_literal: true

require 'rspec'
require 'bundler/setup'
require 'uploadcare/rails'
require 'dry/monads/all'
require 'api_struct'
require 'uploadcare'
require 'action_view'

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
end
