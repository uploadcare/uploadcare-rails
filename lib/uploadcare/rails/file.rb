include ActionView::Helpers::AssetTagHelper

module Uploadcare
  module Rails
    class File < Uploadcare::Api::File

      # override default to string method
      # instead of string representation of object it will return simple cdn url of a file
      def to_s
        cdn_url
      end

      # construct image tag for file
      def image with_operations=true, options={}
        if with_operations
          url = cdn_url_with_operations
        else
          url = cdn_url
        end
        
        image_tag url, options
      end

      def load_data
        super
        ::Rails.cache.write uuid, self
      end

      def load_data!
        super
        ::Rails.cache.write uuid, self
      end
    end
  end
end