# frozen_string_literal: true

require "active_storage/service"
require "base64"
require "digest"
require "net/http"
require "uri"
require "uploadcare-rails"
require "active_storage/service/uploadcare_service/helpers"
require "active_storage/service/uploadcare_service/uuid_mapping"

module ActiveStorage
  class Service
    class UploadcareService < Service
      include Helpers
      include UuidMapping

      attr_reader :client

      def initialize(public_key:, secret_key:, public: false, **options)
        super()
        @public = public
        @key_uuid_map = {}
        @client = Uploadcare::Client.new(public_key: public_key, secret_key: secret_key, **options)
      end

      def upload(key, io, checksum: nil, custom_metadata: {}, **)
        instrument :upload, key: key, checksum: checksum do
          uploaded_file = @client.uploads.upload(io, store: true, metadata: custom_metadata)

          persist_uuid_mapping(key, uploaded_file.uuid)
          ensure_integrity(io, checksum) if checksum
        end
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
          @client.files.batch_delete(uuids: [uuid])
        end
      rescue Uploadcare::Exception::NotFoundError
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
        raise NotImplementedError, "Direct uploads are not supported for UploadcareService yet"
      end

      def headers_for_direct_upload(*)
        {}
      end

      private

      def private_url(key, **)
        uuid = uuid_for!(key)
        file = @client.files.find(uuid: uuid)
        file.cdn_url
      end

      def public_url(key, **)
        uuid = uuid_for!(key)
        file = @client.files.find(uuid: uuid)
        file.cdn_url
      end
    end
  end
end
