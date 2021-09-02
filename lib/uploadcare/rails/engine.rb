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
      end
    end
  end
end
