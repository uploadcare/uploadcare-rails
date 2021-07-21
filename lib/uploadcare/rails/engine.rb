require 'rails/engine'

module Uploadcare
  module Rails
    class Engine < ::Rails::Engine
      initializer 'uploadcare-rails.load' do
        # Load extensions
        # Extend action_view with widget_tag
        ActiveSupport.on_load :action_view do
          require 'uploadcare/rails/action_view/uploadcare_widget_tags'
        end
      end
    end
  end
end
