# frozen_string_literal: true

require 'uploadcare/rails/engine'
require 'uploadcare/rails/configuration'
require 'uploadcare/rails/api/file_api'
require 'uploadcare/rails/api/group_api'
require 'uploadcare/rails/api/project_api'

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
