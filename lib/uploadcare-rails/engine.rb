require 'uploadcare-rails/settings'
require 'uploadcare-rails/action_view'

module Uploadcare
  module Rails
    class Engine < ::Rails::Engine
      initializer 'uploadcare_rails.init_configuration', before: :load_config_initializers do |app|
        app.config.uploadcare = Uploadcare::Rails::Settings.new
      end

      initializer 'uploadcare_rails.make_api' do |app|
        app.config.uploadcare.make_api
      end

      initializer 'uploadcare_rails.load' do
        ActiveSupport.on_load :active_record do
          require 'uploadcare-rails/active_record'
        end

        ActiveSupport.on_load(:action_view) do
          require 'uploadcare-rails/simple_form' if defined?(SimpleForm)
        end
      end
    end
  end
end
