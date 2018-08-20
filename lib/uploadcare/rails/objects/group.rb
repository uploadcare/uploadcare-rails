module Uploadcare
  module Rails
    class Group < Uploadcare::Api::Group

      # warkaround to build images urls without API request
      # builds array of image urls including operations
      def urls(operations = nil)
        operations = Operations.new(operations).to_s

        (0..files_count.to_i - 1).to_a.map do |i|
          [
            @api.options[:static_url_base],
            uuid,
            'nth',
            i,
            operations
          ].join('/')
        end
      end

      def load_data
        load_data! unless is_loaded?
        self
      end

      alias_method :load, :load_data

      def load_data!
        set_data(@api.get("/groups/#{ uuid }/"))
        cache_data
        self
      end

      alias_method :load!, :load_data!

      def cache_data
        return unless UPLOADCARE_SETTINGS.cache_groups
        ::Rails.cache.write(cdn_url, marshal_dump)
        self
      end

      def marshal_dump
        table = @table.deep_dup.stringify_keys!

        if table['files']
          table['files'].map! do |file|
            file.marshal_dump.stringify_keys
          end
        end

        table
      end

      def to_json
        marshal_dump
      end

      def as_json(_options = {})
        marshal_dump
      end

      # override default to string method
      # for group we just will return the uuid
      def to_s
        uuid
      end

      private

      def map_files(data)
        data.stringify_keys!
        data['files'].map! do |file|
          if file.nil?
            file
          else
            Uploadcare::Rails::File.new(@api, file['uuid'], file)
          end
        end

        data
      end
    end
  end
end
