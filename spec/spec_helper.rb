# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV['RAILS_ENV'] ||= 'test'

$LOAD_PATH << File.join(File.dirname(__FILE__))

require 'pry'
require File.expand_path("../dummy/config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'vcr'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

@file_1           = File.open(File.join(File.dirname(__FILE__), 'view.png'))
@uploaded_file_1  = UPLOADCARE_SETTINGS.api.upload(@file_1)

@file_2           = File.open(File.join(File.dirname(__FILE__), 'view2.jpg'))
@uploaded_file_2  = UPLOADCARE_SETTINGS.api.upload(@file_2)

@uploaded_ary_1   = UPLOADCARE_SETTINGS.api.upload [@file_1, @file_2]
@uploaded_group_1 = UPLOADCARE_SETTINGS.api.create_group @uploaded_ary_1

@uploaded_ary_2   = UPLOADCARE_SETTINGS.api.upload [@file_2, @file_1]
@uploaded_group_2 = UPLOADCARE_SETTINGS.api.create_group @uploaded_ary_2

FILE_1_CDN_URL    = @uploaded_file_1.cdn_url
FILE_2_CDN_URL    = @uploaded_file_2.cdn_url
GROUP_1_CDN_URL   = @uploaded_group_1.cdn_url
GROUP_2_CDN_URL   = @uploaded_group_2.cdn_url

RSpec.configure do |config|
  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false
  config.infer_spec_type_from_file_location!
  config.treat_symbols_as_metadata_keys_with_true_values = true
  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  # config.order = "random"

  VCR.configure do |c|
    c.cassette_library_dir = 'spec/cassettes'
    c.hook_into :webmock
    c.debug_logger = File.open('vcs.log', 'w')
    c.default_cassette_options = {
      match_requests_on: %i(method host path)
    }
    c.default_cassette_options = { record: :new_episodes }
    c.configure_rspec_metadata!
  end
end

