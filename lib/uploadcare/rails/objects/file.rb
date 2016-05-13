module Uploadcare
  module Rails
    class File < Uploadcare::Api::File

      # override default to string method
      # instead of string representation of object it will return simple cdn url of a file
      def to_s
        cdn_url
      end

      # construct image tag for file
      def image(with_operations=true, options={})
        return image_tag(cdn_url, options) unless with_operations

        image_tag(cdn_url_with_operations, options)
      end

      def load_data
        super
        ::Rails.cache.write(cdn_url, self.marshal_dump) if UPLOADCARE_SETTINGS.cache_files
        self
      end
      alias_method :load, :load_data

      def load_data!
        super
        ::Rails.cache.write(cdn_url, self.marshal_dump) if UPLOADCARE_SETTINGS.cache_files
        self
      end
      alias_method :load!, :load_data!

      def to_builder
        marshal_dump
      end

      def to_json
        marshal_dump
      end

      def as_json options={}
        marshal_dump
      end

      def marshal_dump
        @table.stringify_keys
      end
    end
  end
end
