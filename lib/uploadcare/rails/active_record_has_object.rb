module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_object attribute, options={}
        # define_method "#{attribute}" do
        #   cdn_url = attributes[attribute.to_s].to_s
          
        #   return nil if cdn_url.empty?

        #   api = UPLOADCARE_SETTINGS.api

        #   if Uploadcare::CDN_URL_GROUP_REGEX.match(cdn_url)
        #     object = api.group(cdn_url)
        #   elsif Uploadcare::CDN_URL_FILE_REGEX.match(cdn_url)
        #     object = api.file(cdn_url)
        #   else
        #     raise "Invalid cdn url was given"
        #   end

        #   binding.pry
        #   object
        # end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord