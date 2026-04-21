# frozen_string_literal: true

require "active_storage/service"
require "base64"
require "digest"
require "net/http"
require "uri"
require "uploadcare-rails"
require "uploadcare/rails/internal/active_storage_service_helpers"
require "uploadcare/rails/internal/active_storage_uuid_mapping"

module ActiveStorage
  class Service
    class UploadcareService < Service
      include Uploadcare::Rails::Internal::ActiveStorageServiceHelpers
      include Uploadcare::Rails::Internal::ActiveStorageUuidMapping

      attr_reader :client, :cdn_hostname

      def initialize(public_key:, secret_key:, public: true, **options)
        super()
        @public = public
        @cdn_hostname = options.delete(:cdn_hostname) || options.delete(:cdn_cname)
        @http_open_timeout = options.delete(:open_timeout) || 5
        @http_read_timeout = options.delete(:read_timeout) || 30
        @http_write_timeout = options.delete(:write_timeout) || 30
        @key_uuid_map = {}
        @key_uuid_map_mutex = Mutex.new
        @client = Uploadcare::Client.new(public_key: public_key, secret_key: secret_key, **options)
      end

      def upload(key, io, checksum: nil, custom_metadata: {}, **)
        uploaded_file = nil

        instrument :upload, key: key, checksum: checksum do
          uploaded_file = @client.uploads.upload(io, store: true, metadata: custom_metadata)
          ensure_integrity(io, checksum) if checksum
          persist_uuid_mapping(key, uploaded_file.uuid)
        end
      rescue ::ActiveStorage::IntegrityError
        @client.files.batch_delete(uuids: [ uploaded_file.uuid ]) if uploaded_file&.uuid.present?
        delete_uuid_mapping(key)
        raise
      end

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

      def download_chunk(key, range)
        uuid = uuid_for!(key)
        download_url = file_download_url(uuid)

        instrument :download_chunk, key: key, range: range do
          request(download_url, range: range, &:body)
        end
      rescue Uploadcare::Exception::NotFoundError
        raise ActiveStorage::FileNotFoundError
      end

      def delete(key)
        uuid = uuid_for(key)
        return unless uuid

        instrument :delete, key: key do
          @client.files.batch_delete(uuids: [ uuid ])
          delete_uuid_mapping(key)
        end
      rescue Uploadcare::Exception::NotFoundError
        delete_uuid_mapping(key)
        nil
      end

      def delete_prefixed(prefix)
        instrument :delete_prefixed, prefix: prefix do
          keys_for_prefix(prefix).each { |key| delete(key) }
        end
      end

      def exist?(key)
        instrument :exist, key: key do |payload|
          payload[:exist] = file_exists?(key)
        rescue Uploadcare::Exception::NotFoundError
          payload[:exist] = false
        end
      end

      def url_for_direct_upload(*)
        raise NotImplementedError,
              "Active Storage direct uploads are not supported by UploadcareService; use uploadcare_file_field/uploadcare_files_field instead"
      end

      def headers_for_direct_upload(*)
        {}
      end

      private

      def private_url(key, **)
        raise NotImplementedError, "Private Uploadcare URLs are not supported; configure the service with public: true"
      end

      def public_url(key, **)
        uuid = uuid_for!(key)
        file_cdn_url(uuid)
      end

      def http_open_timeout
        @http_open_timeout
      end

      def http_read_timeout
        @http_read_timeout
      end

      def http_write_timeout
        @http_write_timeout
      end
    end
  end
end
