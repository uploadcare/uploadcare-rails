require 'uploadcare-rails/settings'

module Uploadcare
  module Rails
    class Engine < ::Rails::Engine
      initializer 'uploadcare_rails.init_configuration', before: :load_config_initializers do |app|
        app.config.uploadcare = Uploadcare::Rails::Settings.new
      end

      initializer 'uploadcare_rails.make_api' do |app|
        app.config.uploadcare.make_api
      end

      initializer 'uploadcare_rails.active_record' do
        ActiveSupport.on_load :active_record do
          require 'uploadcare-rails/active_record'
        end
      end
    end
  end
end
