module Uploadcare
  module Rails
    class Settings < OpenStruct
      def initialize(settings = {}, *args)
        super(*args)
        settings = {
          :public_key => 'demopublickey',
          :private_key => 'demoprivatekey',
          :widget_version => '0.6.8'
        }.update(settings)
        settings.each do |k, v|
          send "#{k}=", v
        end
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
          marshal_dump
            .reject{|k| @@widget_keys[k] == false }
            .keys.map{|k| [@@widget_keys[k] || k, send(k)]}
        ]
      end

      @@client_keys = [
        :public_key, :private_key, :upload_url_base,
        :api_url_base, :static_url_base, :api_version,
        :widget_version
      ]

      def get_settings(keys)
        marshal_dump.select{|k| keys.include? k}
      end

      def get_client_settings
        get_settings(@@client_keys)
      end

      def api
        @api ||= Uploadcare::Api.new(get_client_settings)
      end

      def uploader
        @uploader ||= Uploadcare::Uploader.new(get_client_settings)
      end
    end
  end
end
