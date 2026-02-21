# frozen_string_literal: true

require 'active_storage/service'
require 'base64'
require 'digest'
require 'net/http'
require 'uri'
require 'uploadcare-rails'

module ActiveStorage
  class Service::UploadcareService < Service
    def initialize(public_key:, secret_key:, public: false, **options)
      @public = public
      @key_uuid_map = {}
      @client_config = Uploadcare::Rails.client_config(public_key: public_key, secret_key: secret_key, **options)
    end

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

    def download(key, &block)
      uuid = uuid_for!(key)
      file = Uploadcare::File.info(uuid: uuid, config: @client_config)
      download_url = file.original_file_url || file.cdn_url

      if block_given?
        instrument :streaming_download, key: key do
          request(download_url) { |response| response.read_body { |chunk| yield chunk } }
        end
      else
        instrument :download, key: key do
          request(download_url, &:body)
        end
      end
    rescue Uploadcare::Exception::NotFoundError
      raise ActiveStorage::FileNotFoundError
    end

    def download_chunk(key, range)
      uuid = uuid_for!(key)
      file = Uploadcare::File.info(uuid: uuid, config: @client_config)
      download_url = file.original_file_url || file.cdn_url

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
        Uploadcare::File.new({ uuid: uuid }, @client_config).delete
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
        uuid = uuid_for(key)
        answer = if uuid
                   Uploadcare::File.info(uuid: uuid, config: @client_config)
                   true
                 else
                   false
                 end
        payload[:exist] = answer
        answer
      rescue Uploadcare::Exception::NotFoundError
        payload[:exist] = false
        false
      end
    end

    def url_for_direct_upload(*)
      raise NotImplementedError, 'Direct uploads are not supported for UploadcareService yet'
    end

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

    def request(url, range: nil)
      uri = URI.parse(url)
      request = Net::HTTP::Get.new(uri)
      request['Range'] = "bytes=#{range.begin}-#{range.end}" if range

      Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
        response = http.request(request)
        raise ActiveStorage::FileNotFoundError if response.is_a?(Net::HTTPNotFound)

        yield response
      end
    end

    def ensure_integrity(io, checksum)
      io.rewind
      actual_checksum = Base64.strict_encode64(Digest::MD5.digest(io.read))
      raise ActiveStorage::IntegrityError unless actual_checksum == checksum
    ensure
      io.rewind
    end

    def uuid_for!(key)
      uuid_for(key) || raise(ActiveStorage::FileNotFoundError)
    end

    def uuid_for(key)
      @key_uuid_map[key] || uuid_from_blob(key) || key_if_uuid(key)
    end

    def persist_uuid_mapping(key, uuid)
      @key_uuid_map[key] = uuid
      persist_uuid_to_blob(key, uuid)
    end

    def uuid_from_blob(key)
      return unless defined?(ActiveStorage::Blob)

      blob = ActiveStorage::Blob.find_by(key: key)
      blob&.metadata&.[]('uploadcare_uuid')
    end

    def persist_uuid_to_blob(key, uuid)
      return unless defined?(ActiveStorage::Blob)

      blob = ActiveStorage::Blob.find_by(key: key)
      return unless blob

      metadata = (blob.metadata || {}).dup
      return if metadata['uploadcare_uuid'] == uuid

      metadata['uploadcare_uuid'] = uuid
      blob.update!(metadata: metadata)
    end

    def keys_for_prefix(prefix)
      if defined?(ActiveStorage::Blob)
        ActiveStorage::Blob.where('key LIKE ?', "#{prefix}%").pluck(:key)
      else
        @key_uuid_map.keys.select { |key| key.start_with?(prefix) }
      end
    end

    def key_if_uuid(key)
      key if key.to_s.match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i)
    end
  end
end
