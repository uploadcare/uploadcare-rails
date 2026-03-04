# frozen_string_literal: true

require "active_storage/service"
require "base64"
require "digest"
require "net/http"
require "uri"
require "uploadcare-rails"
require "active_storage/service/uploadcare_service/helpers"
require "active_storage/service/uploadcare_service/uuid_mapping"

# Namespace for ActiveStorage integration.
module ActiveStorage
  # Service implementations for ActiveStorage.
  class Service
    # ActiveStorage backend implementation for Uploadcare.
    class UploadcareService < Service
      include Helpers
      include UuidMapping

      def initialize(public_key:, secret_key:, public: false, **options)
        super()
        @public = public
        @key_uuid_map = {}
        @client_config = Uploadcare::Rails.client_config(public_key: public_key, secret_key: secret_key, **options)
      end

      # Uploads a blob to Uploadcare and persists key-to-uuid mapping.
      # @param key [String]
      # @param io [IO]
      # @param checksum [String, nil]
      # @param custom_metadata [Hash]
      # @return [void]
      def upload(key, io, checksum: nil, custom_metadata: {}, **)
        instrument :upload, key: key, checksum: checksum do
          uploaded_file = Uploadcare::Uploader.upload_file(
            file: io,
            config: @client_config,
            store: true,
            metadata: custom_metadata
          )

          persist_uuid_mapping(key, uploaded_file.uuid)
          ensure_integrity(io, checksum) if checksum
        end
      end

      # Downloads a blob from Uploadcare.
      # @param key [String]
      # @yield [chunk] optional streaming chunk callback
      # @return [String, void]
      def download(key, &block)
        uuid = uuid_for!(key)
        download_url = file_download_url(uuid)
        if block_given?
          stream_download(key, download_url, &block)
        else
          instrument(:download, key: key) { request(download_url, &:body) }
        end
      rescue Uploadcare::Exception::NotFoundError
        raise ActiveStorage::FileNotFoundError
      end

      # Downloads a specific byte range from a blob.
      # @param key [String]
      # @param range [Range]
      # @return [String]
      def download_chunk(key, range)
        uuid = uuid_for!(key)
        download_url = file_download_url(uuid)

        instrument :download_chunk, key: key, range: range do
          request(download_url, range: range, &:body)
        end
      rescue Uploadcare::Exception::NotFoundError
        raise ActiveStorage::FileNotFoundError
      end

      # Deletes a blob from Uploadcare if mapping exists.
      # @param key [String]
      # @return [void]
      def delete(key)
        uuid = uuid_for(key)
        return unless uuid

        instrument :delete, key: key do
          Uploadcare::File.new({ uuid: uuid }, @client_config).delete
        end
      rescue Uploadcare::Exception::NotFoundError
        nil
      end

      # Deletes all blobs whose key starts with prefix.
      # @param prefix [String]
      # @return [void]
      def delete_prefixed(prefix)
        instrument :delete_prefixed, prefix: prefix do
          keys_for_prefix(prefix).each { |key| delete(key) }
        end
      end

      # Checks whether mapped blob exists in Uploadcare.
      # @param key [String]
      # @return [Boolean]
      def exist?(key)
        instrument :exist, key: key do |payload|
          payload[:exist] = file_exists?(key)
        rescue Uploadcare::Exception::NotFoundError
          payload[:exist] = false
        end
      end

      # Direct uploads are not supported.
      # @raise [NotImplementedError]
      def url_for_direct_upload(*)
        raise NotImplementedError, "Direct uploads are not supported for UploadcareService yet"
      end

      # Returns direct upload headers.
      # @return [Hash]
      def headers_for_direct_upload(*)
        {}
      end

      private

      def private_url(key, **)
        uuid = uuid_for!(key)
        Uploadcare::File.new({ uuid: uuid }, @client_config).cdn_url
      end

      def public_url(key, **)
        uuid = uuid_for!(key)
        Uploadcare::File.new({ uuid: uuid }, @client_config).cdn_url
      end
    end
  end
end
