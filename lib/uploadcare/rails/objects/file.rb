module Uploadcare
  module Rails
    class File < Uploadcare::Api::File
      def url(operations = nil)
        cdn_url unless operations
        cdn_url + prepared_operations(operations)
      end

      def prepared_operations(operations)
        Uploadcare::Rails::Operations.new(operations).to_s
      end

      # construct image tag for file
      def image(operations = nil)
        image_tag(url(operations))
      end

      # override default to string method
      # instead of string representation of object it will return simple cdn url of a file
      def to_s
        cdn_url
      end

      def to_builder
        marshal_dump
      end

      def to_json
        marshal_dump
      end

      def as_json(_options = {})
        marshal_dump
      end

      def marshal_dump
        @table.stringify_keys
      end
    end
  end
end
