require File.absolute_path('lib/uploadcare-rails/version.rb')

Gem::Specification.new do |s|
  s.name         = 'uploadcare-rails'
  s.version      = Uploadcare::Rails::VERSION
  s.summary      = "Rubygem to use UploadCare.com service with ease."
  s.description  = "Rubygem to use UploadCare.com service and serve file uploads in your Rails projects."
  s.authors      = ["Alexander Zinchenko"]
  s.email        = 'az@uploadcare.com'
  s.files        = Dir['lib/**/*.rb'] << 'init.rb'
  s.require_paths = ['lib']
  s.homepage     = 'http://github.com/uploadcare/uploadcare-rails'

  s.add_runtime_dependency 'uploadcare'

  s.post_install_message = <<-EOS
  ==================================================
  Thank you for installing Uploadcare.com Rails gem.
  Make sure you completed steps described in the
  gem README.
  ==================================================
  EOS
end