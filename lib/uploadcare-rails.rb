require 'uploadcare'

require_relative 'uploadcare/rails/engine'
require_relative 'uploadcare/rails/settings'
require_relative 'uploadcare/rails/operations'
require_relative 'uploadcare/rails/objects/file'
require_relative 'uploadcare/rails/objects/group'

module Uploadcare
  module Rails
    DEFAULT_SETTINGS = {
      widget_version: '2.x'
    }
  end
end
