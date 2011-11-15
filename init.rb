require File.join(File.dirname(__FILE__), "lib", "uploadcare-rails")
require 'uploadcare-rails/inject'

Uploadcare::Rails::Inject.try_inject
