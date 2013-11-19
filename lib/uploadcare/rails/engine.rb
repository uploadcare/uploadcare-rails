require "rails/engine"
require "uploadcare/rails/settings"

module Uploadcare
  module Rails
    class Engine < ::Rails::Engine
      initializer 'uploadcare_rails.load' do
        # load actual rails extentions

        # active record extention for stand-alone file models and models has files
        ActiveSupport.on_load :active_record do
          require 'uploadcare/rails/active_record_attribute'
          require 'uploadcare/rails/active_record_standalone'
        end

        # # JS options, widets from cdn etc
        # ActiveSupport.on_load(:action_view) do
        #   require 'uploadcare/rails/include_tags'
        #   require 'uploadcare/rails/helpers'

        #   # form helpers
        #   require 'uploadcare/rails/form_helpers'
        #   require 'uploadcare/rails/simple_form' if defined?(SimpleForm)
        # end
      end
    end
  end
end