module Uploadcare
  module Rails
    class File

      def initialize(api, cdn_url)
        @api = api
        @cdn_url = cdn_url
      end

      def cdn_url(*operations)
        @api.cdn_url(@cdn_url, *operations)
      end

      alias_method :public_url, :cdn_url

      def api
        @file ||= @api.file(@cdn_url)
      end

      alias_method :info, :api

    end
  end
end
