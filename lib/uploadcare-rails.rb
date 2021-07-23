# frozen_string_literal: true

require 'uploadcare/rails/engine'
require 'uploadcare/rails/configuration'
require 'uploadcare/rails/api/rest/file_api'
require 'uploadcare/rails/api/rest/group_api'
require 'uploadcare/rails/api/rest/project_api'
require 'uploadcare/rails/api/rest/webhook_api'
require 'uploadcare/rails/api/upload/upload_api'

module Uploadcare
  # A root module for the gem
  module Rails
    module_function

    def configure
      yield configuration
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
