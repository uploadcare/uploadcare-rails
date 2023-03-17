# frozen_string_literal: true

$LOAD_PATH.push File.expand_path('lib', __dir__)

# Maintain your gem's version:
require 'uploadcare/rails/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |gem|
  gem.required_ruby_version = '>= 2.7.0'

  gem.name          = 'uploadcare-rails'
  gem.authors       = ['@dmitrijivanchenko (Dmitrij Ivanchenko), @T0mbery (Andrey Aksenov)', 'kraft001 (Konstantin Rafalskii)']
  gem.email         = ['hello@uploadcare.com']
  gem.summary       = 'Rails gem for Uploadcare'
  gem.description   = <<~DESCRIPTION
    Rails API client (based on uploadcare-ruby) that handles uploads
    and further operations with files by wrapping Uploadcare Upload and REST APIs.
  DESCRIPTION
  gem.metadata = {
    'github' => 'https://github.com/uploadcare/uploadcare-rails',
    'issue_tracker' => 'https://github.com/uploadcare/uploadcare-rails/issues',
    'rubygems_mfa_required' => 'true'
  }
  gem.homepage      = 'https://github.com/uploadcare/uploadcare-rails'
  gem.license       = 'MIT'

  gem.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.rdoc']
  gem.version = Uploadcare::Rails::VERSION
  gem.add_dependency 'rails', '>= 6'
  gem.add_dependency 'uploadcare-ruby', '>= 4.3'

  gem.add_development_dependency 'rspec', '~> 3.12'
  gem.add_development_dependency 'rspec-rails', '>= 5.1'
  gem.add_development_dependency 'rubocop', '~> 1.48'
  gem.add_development_dependency 'vcr', '~> 6.1'
  gem.add_development_dependency 'webmock', '~> 3.18'
end
