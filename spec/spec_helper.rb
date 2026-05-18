# frozen_string_literal: true

require 'rspec'
require 'bundler/setup'
require 'uploadcare/rails'
require 'uploadcare'
require 'action_view'
require 'ostruct'

Dir[File.expand_path(File.join(File.dirname(__FILE__), 'support', '**', '*.rb'))].sort.each { |f| require f }

RSpec.configure do |config|
  config.example_status_persistence_file_path = '.rspec_status'
  config.disable_monkey_patching!
  config.expose_dsl_globally = true

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  config.include ActionView::Helpers, type: :helper
end
