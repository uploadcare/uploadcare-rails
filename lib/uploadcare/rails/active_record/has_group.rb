require "uploadcare/rails/objects/group"

module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_group attribute, options={}

        define_method "has_#{attribute}_as_uploadcare_file?" do
          false
        end

        define_method "has_#{attribute}_as_uploadcare_group?" do
          true
        end

        # attribute method - return file object
        define_method "#{attribute}" do
          cdn_url = attributes[attribute.to_s].to_s
          
          return nil if cdn_url.empty?

          api = UPLOADCARE_SETTINGS.api
          cache = ::Rails.cache
          if group_obj = cache.read(cdn_url)
            group = Uploadcare::Rails::Group.new api, cdn_url, group_obj
          else
            group = Uploadcare::Rails::Group.new api, cdn_url
          end
        end

        # before saving we checking what it is a actually file cdn url
        # or uuid. uuid will do.
        # group url or uuid should raise an erorr
        before_save "check_#{attribute}_for_uuid"

        define_method "check_#{attribute}_for_uuid" do
          url = self.attributes[attribute.to_s]
          unless url.empty?
            result = Uploadcare::Parser.parse(url)
            raise "Invalid group uuid" if result.is_a?(Uploadcare::Parser::Group)
          end
        end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord