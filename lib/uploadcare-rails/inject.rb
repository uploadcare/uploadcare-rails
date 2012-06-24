require 'uploadcare-rails'

module Uploadcare::Rails::Inject
  if defined? Rails::Railtie
    require 'rails'
    
    class Railtie < Rails::Railtie
      initializer 'uploadcare.insert_into_active_record' do
        ActiveSupport.on_load :active_record do
          Uploadcare::Rails.install unless Uploadcare::Rails.installed?
          Uploadcare::Rails::Inject.try_inject
        end
      end
    end  
  end
  
  def self.try_inject
    ActiveRecord::Base.send(:include, Uploadcare::Rails::ActiveRecord) if defined? ActiveRecord
    ActionView::Helpers::FormBuilder.send(:include, Uploadcare::Rails::FormBuilder) if defined? ActionView
  end
end