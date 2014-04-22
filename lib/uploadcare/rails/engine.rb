require "rails/engine"
require "uploadcare/rails/settings"

module Uploadcare
  module Rails
    class Engine < ::Rails::Engine
      initializer 'uploadcare-rails.load' do
        # load actual rails extentions
        
        # active record extention for stand-alone file models and models has files
        ActiveSupport.on_load :active_record do
          require 'uploadcare/rails/active_record/has_file'
          require 'uploadcare/rails/active_record/has_group'
        end

        # JS options, widets from cdn etc
        ActiveSupport.on_load :action_view do
          require 'uploadcare/rails/action_view/include_tags'
          require 'uploadcare/rails/action_view/uploader_tags'
          
          # Simple Form helpers
          require 'uploadcare/rails/simple_form/simple_form' if defined?(SimpleForm)

          # Formastic helpers
          require 'uploadcare/rails/formtastic/formtastic' if defined?(Formtastic)
        end
      end
    end
  end
end