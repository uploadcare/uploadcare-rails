include ActionView::Helpers::AssetTagHelper

module Uploadcare
  module Rails
    class Group < Uploadcare::Api::Group

      # override default to string method
      # for group we just will return the uuid
      def to_s
        uuid
      end

      def load_data
        super
        ::Rails.cache.write(cdn_url, self.marshal_dump) if UPLOADCARE_SETTINGS.cache_groups
        self
      end
      alias_method :load, :load_data

      def load_data!
        super
        ::Rails.cache.write(cdn_url, self.marshal_dump) if UPLOADCARE_SETTINGS.cache_groups
        self
      end
      alias_method :load!, :load_data!

      def marshal_dump
        table = @table.stringify_keys
        if table["files"]
          table["files"].map! do |file|
            file.marshal_dump
          end
        end
        table
      end

      private
        def map_files data
          data.stringify_keys!
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