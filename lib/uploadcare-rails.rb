# frozen_string_literal: true

require "uploadcare/rails/engine"
require "uploadcare/rails/configuration"
require "uploadcare/rails/objects/file"
require "uploadcare/rails/objects/group"

module Uploadcare
  module Rails
    class << self
      def configure
        yield configuration
        sync_sdk_configuration
      end

      def configuration
        @configuration
      end

      def initialize_config
        @configuration = Uploadcare::Rails::Configuration.instance
      end

      def client(public_key: nil, secret_key: nil, **options)
        if public_key || secret_key || options.any?
          Uploadcare::Client.new(
            public_key: public_key || configuration.public_key,
            secret_key: secret_key || configuration.secret_key,
            **options
          )
        else
          @default_client ||= Uploadcare::Client.new(
            public_key: configuration.public_key,
            secret_key: configuration.secret_key
          )
        end
      end

      def resolve_client(client_or_options = nil)
        case client_or_options
        when Uploadcare::Client
          client_or_options
        when Hash
          client(**client_or_options.symbolize_keys)
        when nil
          client
        else
          client
        end
      end

      def reset_default_client!
        @default_client = nil
      end

      def serialize_client_options(client_instance)
        return {} unless client_instance

        client_instance.config.to_h
      end

      def build_client_from_options(options = {})
        return client if options.blank?

        Uploadcare::Client.new(**options.symbolize_keys)
      end

      private

      def sync_sdk_configuration
        Uploadcare.configure do |config|
          config.public_key = configuration.public_key if configuration.public_key
          config.secret_key = configuration.secret_key if configuration.secret_key
        end
        reset_default_client!
      end
    end

    initialize_config
  end
end
