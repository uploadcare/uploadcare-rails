include ActionView::Helpers::AssetTagHelper

module Uploadcare
  module Rails
    class Group < Uploadcare::Api::Group

      # override default to string method
      # instead of string representation of object it will return simple cdn url of a file
      def to_s
        cdn_url
      end
    end
  end
end