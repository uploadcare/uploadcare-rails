include ActionView::Helpers::AssetTagHelper

module Uploadcare
  module Rails
    class Group < Uploadcare::Api::Group

      # override default to string method
      # for group we just will return the uuid
      def to_s
        uuid
      end
    end
  end
end