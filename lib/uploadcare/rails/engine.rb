# frozen_string_literal: true

require 'rails/engine'

module Uploadcare
  module Rails
    # Rails engine that allows to extend default rails libraries
    class Engine < ::Rails::Engine
      initializer 'uploadcare-rails.load' do
        # Load extensions
        # Extend action_view with widget_tag
        ActiveSupport.on_load :action_view do
          require 'uploadcare/rails/action_view/uploadcare_include_tags'
          require 'uploadcare/rails/action_view/uploadcare_uploader_tags'
        end

        # Load extensions for active_record
        # Extend active_record with mount_uploadcare_file and mount_uploadcare_file_group methods
        ActiveSupport.on_load :active_record do
          require 'uploadcare/rails/active_record/mount_uploadcare_file'
          require 'uploadcare/rails/active_record/mount_uploadcare_file_group'
        end
      end
    end
  end
end
