# frozen_string_literal: true

$LOAD_PATH.push File.expand_path('lib', __dir__)

# Maintain your gem's version:
require 'uploadcare/rails/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |gem|
  gem.required_ruby_version = '>= 2.7.0'

  gem.name          = 'uploadcare-rails'
  gem.authors       = ['@dmitrijivanchenko (Dmitrij Ivanchenko), @T0mbery (Andrey Aksenov)',
                       'kraft001 (Konstantin Rafalskii)']
  gem.email         = ['hello@uploadcare.com']
  gem.summary       = 'Rails gem for Uploadcare'
  gem.description   = <<~DESCRIPTION
    Rails API client (based on uploadcare-ruby) that handles uploads
    and further operations with files by wrapping Uploadcare Upload and REST APIs.
  DESCRIPTION
  gem.metadata = {
    'source_code_uri' => 'https://github.com/uploadcare/uploadcare-rails',
    'bug_tracker_uri' => 'https://github.com/uploadcare/uploadcare-rails/issues',
    'changelog_uri' => 'https://github.com/uploadcare/uploadcare-rails/blob/main/CHANGELOG.md',
    'documentation_uri' => 'https://www.rubydoc.info/gems/uploadcare-rails/',
    'homepage_uri' => 'https://uploadcare.com/',
    'rubygems_mfa_required' => 'true'
  }
  gem.homepage      = 'https://uploadcare.com/'
  gem.license       = 'MIT'

  gem.files = Dir[
    'lib/**/*',
    'Gemfile',
    'Rakefile',
    'uploadcare-rails.gemspec',
    'LICENSE.txt',
    'README.md',
    'CHANGELOG.md'
  ]

  gem.extra_rdoc_files  = %w[README.md LICENSE.txt]
  gem.rdoc_options      = %w[--line-numbers --title Uploadcare --main README.rdoc --encoding=UTF-8]

  gem.version = Uploadcare::Rails::VERSION
  gem.add_dependency 'rails', '>= 6'
  gem.add_dependency 'uploadcare-ruby', '>= 4.3'
end
