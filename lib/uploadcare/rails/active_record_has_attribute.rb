module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_file attribute, options={}
        define_method "#{attribute}" do
          cdn_url = attributes[attribute.to_s].to_s
          
          return nil if cdn_url.empty?
          binding.pry
          cdn_url
          # file = UPLOADCARE_SETTINGS.api.file cdn_url
        end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord