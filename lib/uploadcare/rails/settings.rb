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
        settings = {
          :public_key => 'demopublickey',
          :private_key => 'demoprivatekey',
          :widget_version => '0.6.8'
        }.update(settings)
        @@keys.each do |key|
          send "#{key}=", settings[key] if settings[key].present?
        end
      end

      def get_settings
        Hash[@@keys.select{|k| send(k).present? }.map{|k| [k, send(k)]}]
      end

      @@widget_keys = {
        # Excluded
        :api_url_base => false,
        :api_version => false,
        :private_key => false,
        :widget_version => false,

        # Renamed
        :static_url_base => :cdn_base,
        :upload_url_base => :url_base
      }

      def get_widget_settings
        Hash[
          @@keys
            .reject{|k| @@widget_keys[k] == false }
            .map{|k| [@@widget_keys[k] || k, send(k)]}
        ]
      end

      def make_api
        @api = Uploadcare::Api.new(get_settings)
      end

      def make_uploader
        @uploader = Uploadcare::Uploader.new(get_settings)
      end
    end
  end
end
