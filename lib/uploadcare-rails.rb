require "uploadcare-rails/version"
require "uploadcare-rails/inject"

module Uploadcare
  module Rails
    # No-op
  end
  
  module Rails
    module ClassMethods
      def has_uploadcare_file(name, options = {})
      
      end
    end
    
    module ActiveRecord
      def self.included(base)
        base.extend ClassMethods
      end
    end
  end
end

Uploadcare::Rails::Inject.try_inject