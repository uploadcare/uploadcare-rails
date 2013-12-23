include ActionView::Helpers::AssetTagHelper

module Uploadcare
  module Rails
    class Group < Uploadcare::Api::Group

      # override default to string method
      # for group we just will return the uuid
      def to_s
        uuid
      end

      private
        def map_files data
          data["files"].map! do |file|
            unless file.nil?
              Uploadcare::Rails::File.new(@api, file["uuid"], file)
            else
              file
            end
          end

          data
        end
    end
  end
end