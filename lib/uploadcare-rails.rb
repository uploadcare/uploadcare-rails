# frozen_string_literal: true

require 'uploadcare/rails/engine'
require 'uploadcare/rails/configuration'
require 'uploadcare/rails/objects/file'
require 'uploadcare/rails/objects/group'
require 'uploadcare/rails/api/rest/file_api'
require 'uploadcare/rails/api/rest/group_api'
require 'uploadcare/rails/api/rest/project_api'
require 'uploadcare/rails/api/rest/webhook_api'
require 'uploadcare/rails/api/rest/conversion_api'
require 'uploadcare/rails/api/rest/file_metadata_api'
require 'uploadcare/rails/api/rest/addons_api'
require 'uploadcare/rails/api/upload/upload_api'

module Uploadcare
  # A root module for the gem
  module Rails
    module_function

    def configure
      yield configuration
      overwrite_ruby_config
    end

    def overwrite_ruby_config
      # copy Rails config to Ruby config
      %i[public_key secret_key].each do |param_name|
        value = configuration.public_send(param_name)
        Uploadcare.config[param_name] = value unless value.nil?
      end
    end

    def configuration
      @configuration
    end

    def initialize_config
      @configuration = Uploadcare::Rails::Configuration.instance
    end

    initialize_config
  end
end
