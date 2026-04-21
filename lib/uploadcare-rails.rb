# frozen_string_literal: true

require "uploadcare"
require "uploadcare/rails/version"
require "uploadcare/rails/engine"

module Uploadcare
  module Rails
    autoload :Configuration, "uploadcare/rails/configuration"
    autoload :AttachedFile, "uploadcare/rails/attached_file"
    autoload :AttachedFiles, "uploadcare/rails/attached_files"
    autoload :StoreFileJob, "uploadcare/rails/jobs/store_file_job"
    autoload :StoreGroupJob, "uploadcare/rails/jobs/store_group_job"
    autoload :DeleteFileJob, "uploadcare/rails/jobs/delete_file_job"

    module Internal
      autoload :ClientResolver, "uploadcare/rails/internal/client_resolver"
      autoload :IdExtractor, "uploadcare/rails/internal/id_extractor"
      autoload :FilesCountExtractor, "uploadcare/rails/internal/files_count_extractor"
    end

    extend Internal::ClientResolver

    class Error < StandardError; end

    class << self
      def configure
        yield configuration
        sync_sdk_configuration
      end

      def configuration
        @configuration ||= Configuration.new
      end

      def configuration=(config)
        @configuration = config.is_a?(Configuration) ? config : Configuration.new(config)
        sync_sdk_configuration
      end

      def client(public_key: nil, secret_key: nil, **options)
        if public_key || secret_key || options.any?
          Uploadcare::Client.new(
            public_key: public_key || configuration.public_key,
            secret_key: secret_key || configuration.secret_key,
            **options
          )
        else
          client_mutex.synchronize do
            @default_client ||= Uploadcare::Client.new(
              public_key: configuration.public_key,
              secret_key: configuration.secret_key
            )
          end
        end
      end

      def reset_default_client!
        client_mutex.synchronize { @default_client = nil }
      end

      private

      def client_mutex
        @client_mutex ||= Mutex.new
      end

      def sync_sdk_configuration
        Uploadcare.configure do |config|
          config.public_key = configuration.public_key if configuration.public_key
          config.secret_key = configuration.secret_key if configuration.secret_key
        end
        reset_default_client!
      end
    end
  end
end
