
$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'uploadcare/rails/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |gem|
  gem.name          = 'uploadcare-rails'
  gem.authors       = ["@dmitrijivanchenko (Dmitrij Ivanhcneko)"]
  gem.email         = ['hello@uploadcare.com']
  gem.summary       = 'Rails gem for Uploadcare'
  gem.description   = <<-EOF
                        Rails wrapper for Uploadcare service.
                        Based on uploadcare-ruby gem (https://github.com/uploadcare/uploadcare-ruby)
                      EOF
  gem.metadata       =  {
                          'github' => 'https://github.com/uploadcare/uploadcare-rails',
                          'issue_tracker' => 'https://github.com/uploadcare/uploadcare-rails/issues'
                        }
  gem.homepage      = 'https://uploadcare.com/docs/libs/'
  gem.license       = 'MIT'

  gem.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.rdoc']
  gem.test_files = Dir['spec/**/*']
  gem.version       = Uploadcare::Rails::VERSION
  gem.add_dependency 'rails', '>= 4'
  gem.add_dependency 'uploadcare-ruby'

  gem.add_development_dependency 'rspec', '> 3.4.4'
  gem.add_development_dependency 'rspec-rails'
  gem.add_development_dependency 'capybara'
  gem.add_development_dependency 'pry'
  gem.add_development_dependency 'pry-rails'
  gem.add_development_dependency 'better_errors'
  gem.add_development_dependency 'guard-rspec'
  gem.add_development_dependency 'webmock'
  gem.add_development_dependency 'vcr'
end
