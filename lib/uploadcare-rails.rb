require 'uploadcare/rails/engine'
require 'uploadcare/rails/configuration'

module Uploadcare
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
