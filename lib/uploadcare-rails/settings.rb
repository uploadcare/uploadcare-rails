module Uploadcare
  module Rails
    class Settings
      @@keys = [
        :public_key, :private_key, :upload_url_base,
        :api_url_base, :static_url_base, :api_version,
        :widget_version
      ]
      cattr_reader :keys

      keys.each { |key| attr_accessor key }
      attr_reader :api, :uploader
      

      def initialize(settings = {})
        self.class.keys.each do |key|
          send "#{key}=", settings[key] if settings[key].present?
        end
      end

      def get_settings
        Hash[self.class.keys.select{|k| send(k).present? }.map{|k| [k, send(k)]}]
      end

      def make_api
        @api = Uploadcare::Api.new(get_settings)
      end
    end
  end
end