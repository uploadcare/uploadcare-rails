module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_file attribute, options={}
        # attribute method - return file object
        define_method "#{attribute}" do
          cdn_url = attributes[attribute.to_s].to_s
          
          # return nil if cdn_url.empty?

          # cdn_url

          # api = UPLOADCARE_SETTINGS.api

          # if Uploadcare::CDN_URL_GROUP_REGEX.match(cdn_url)
          #   object = api.group(cdn_url)
          # elsif Uploadcare::CDN_URL_FILE_REGEX.match(cdn_url)
          #   object = api.file(cdn_url)
          # else
          #   raise "Invalid cdn url was given"
          # end

          # binding.pry
          # object

        end

        # before saving we checking what it is a actually file cdn url
        # or uuid. uuid will do.
        # group url or uuid should raise an erorr
        before_save "check_#{attribute}_for_uuid"

        define_method "check_#{attribute}_for_uuid" do
          url = self.attributes[attribute.to_s]
          unless url.empty?
            result = Uploadcare::Parser.parse(url)
            raise 
          end
        end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord