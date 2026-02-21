# frozen_string_literal: true

source 'https://rubygems.org'

# Specify your gem's dependencies in uploadcare-rails.gemspec
gemspec

local_uploadcare_ruby = File.expand_path('../uploadcare-ruby', __dir__)
if File.directory?(local_uploadcare_ruby)
  gem 'uploadcare-ruby', path: local_uploadcare_ruby
else
  gem 'uploadcare-ruby', github: 'uploadcare/uploadcare-ruby', branch: 'v2-rewrite-2'
end

gem 'http-parser', '~> 1.2', '>= 1.2.3'
gem 'rake', '~> 13.0.6'

group :test do
  gem 'mongoid', '~> 9', require: false
  gem 'rspec', '~> 3.12'
  gem 'rspec-rails', '>= 5.1'
  gem 'rubocop', '~> 1.48'
  gem 'vcr', '~> 6.1'
  gem 'webmock', '~> 3.18'
end
