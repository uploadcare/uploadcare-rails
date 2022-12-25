# frozen_string_literal: true

$LOAD_PATH.push File.expand_path('lib', __dir__)

# Maintain your gem's version:
require 'uploadcare/rails/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |gem|
  gem.required_ruby_version = '>= 2.4.0'

  gem.name          = 'uploadcare-rails'
  gem.authors       = ['@dmitrijivanchenko (Dmitrij Ivanchenko), @T0mbery (Andrey Aksenov)']
  gem.email         = ['hello@uploadcare.com']
  gem.summary       = 'Rails gem for Uploadcare'
  gem.description   = <<~DESCRIPTION
    Rails wrapper for Uploadcare service.
    Based on uploadcare-ruby gem (https://github.com/uploadcare/uploadcare-ruby)
  DESCRIPTION
  gem.metadata = {
    'github' => 'https://github.com/uploadcare/uploadcare-rails',
    'issue_tracker' => 'https://github.com/uploadcare/uploadcare-rails/issues'
  }
  gem.homepage      = 'https://uploadcare.com/docs/integrations/'
  gem.license       = 'MIT'

  gem.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.rdoc']
  gem.test_files = Dir['spec/**/*']
  gem.version = Uploadcare::Rails::VERSION
  gem.add_dependency 'rails', '>= 4'
  gem.add_dependency 'uploadcare-ruby', '>= 4.1'

  # rubocop:disable Gemspec/RubyVersionGlobalsUsage
  if RUBY_VERSION.start_with?('3')
    gem.add_development_dependency 'dry-configurable', '0.13.0'
  else
    gem.add_development_dependency 'dry-configurable'
  end
  # rubocop:enable Gemspec/RubyVersionGlobalsUsage

  gem.add_development_dependency 'rspec', '> 3.4.4'
  gem.add_development_dependency 'rspec-rails'
  gem.add_development_dependency 'rubocop'
  gem.add_development_dependency 'vcr'
  gem.add_development_dependency 'webmock'
end
