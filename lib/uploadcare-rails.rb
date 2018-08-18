require 'uploadcare'

require_relative 'uploadcare/rails/version'
require_relative 'uploadcare/rails/engine'
require_relative 'uploadcare/rails/settings'
require_relative 'uploadcare/rails/operations'
require_relative 'uploadcare/rails/objects/file'
require_relative 'uploadcare/rails/objects/group'

module Uploadcare
  module Rails
    DEFAULT_SETTINGS = {
      widget_version: '3.x',
      user_agent_environment: {
        framework_name: 'Rails',
        framework_version: ::Rails.version,
        extension_name: 'UploadcareRails',
        extension_version: Uploadcare::Rails::VERSION
      }
    }.freeze
  end
end
