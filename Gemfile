# frozen_string_literal: true

source "https://rubygems.org"

# Specify your gem's dependencies in uploadcare-rails.gemspec
gemspec

gem "uploadcare-ruby", github: "uploadcare/uploadcare-ruby", branch: "gem-rewrite-3"

gem "http-parser", "~> 1.2", ">= 1.2.3"
gem "rake", "~> 13.0.6"

group :test do
  gem "benchmark", "~> 0.4"
  gem "mongoid", "~> 9", require: false
  gem "ostruct"
  gem "rspec", "~> 3.12"
  gem "rspec-rails", ">= 5.1"
  gem "rubocop-rails-omakase", require: false
  gem "vcr", "~> 6.1"
  gem "webmock", "~> 3.18"
  gem "yard", "~> 0.9"
end
