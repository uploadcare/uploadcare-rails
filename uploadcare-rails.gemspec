$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "uploadcare/rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "uploadcare-rails"
  s.version     = Uploadcare::Rails::VERSION
  s.authors     = ["@rastyagaev (Vadim Rastyagaev)",
                   "@dimituri (Dimitry Solovyov)",
                   "@romanonthego (Roman Dubinin)"]
  s.email       = ["hello@uploadcare.com"]
  s.homepage    = "http://uploadcare.com"
  s.summary     = "Rails gem for Uploadcare"
  s.description = "Rails gem for uploadcare.com service."
  s.license = ''

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 3.2"
  s.add_dependency "uploadcare-api", "~> 0.1.4"
  # s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "pry-rails"
end
