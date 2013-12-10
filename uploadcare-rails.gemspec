$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "uploadcare/rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |gem|
  gem.name        = "uploadcare-rails"
  gem.version     = Uploadcare::Rails::VERSION
  gem.authors     = ["TODO: Your name"]
  gem.email       = ["TODO: Your email"]
  gem.homepage    = "TODO"
  gem.summary     = "TODO: Summary of UploadcareRails."
  gem.description = "TODO: Description of UploadcareRails."

  gem.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  gem.test_files = Dir["spec/**/*"]

  gem.add_dependency "rails", "~> 4.0.1"
  gem.add_dependency "uploadcare-ruby", "~> 1.0.0"

  gem.add_development_dependency "sqlite3"
  gem.add_development_dependency 'rspec'
  gem.add_development_dependency 'rspec-rails'
  gem.add_development_dependency 'pry'
  gem.add_development_dependency 'pry-rails'
  gem.add_development_dependency 'better_errors'
end
