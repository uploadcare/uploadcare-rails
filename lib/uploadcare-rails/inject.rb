require 'uploadcare-rails'

module Uploadcare::Rails::Inject
  if defined? Rails::Railtie
    require 'rails'
    
    class Railtie < Rails::Railtie
      initializer 'uploadcare.insert_into_active_record' do
        ActiveSupport.on_load :active_record do
          Uploadcare::Rails::Inject.try_inject
        end
      end
    end  
  end
  
  def self.try_inject
    require 'uploadcare' unless defined? Uploadcare::Uploadcare
    ActiveRecord::Base.send(:include, Uploadcare::Rails::ActiveRecord)
    ActionView::Helpers::FormBuilder.send(:include, Uploadcare::Rails::FormBuilder)
  end
end