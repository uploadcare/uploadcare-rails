# frozen_string_literal: true

require 'uploadcare/rails/engine'
require 'uploadcare/rails/configuration'

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
      @configuration = Configuration.instance
    end

    initialize_config
  end
end
