$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "uploadcare/rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "uploadcare-rails"
  s.version     = Uploadcare::Rails::VERSION
  s.authors     = ["Vadim Rastyagaev"]
  s.email       = ["abc@oktoberliner.ru"]
  s.homepage    = "http://uploadcare.com"
  s.summary     = "Rails gem for uploadcare.com service."
  s.description = "Rails gem for uploadcare.com service."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency "rails", "~> 3.2"
  s.add_dependency "uploadcare-api"
  s.add_dependency "uploadcare-widget"
  # s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "pry-rails"
end
