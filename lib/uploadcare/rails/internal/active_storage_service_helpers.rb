# frozen_string_literal: true

require "net/http"
require "uploadcare/rails/internal/trusted_uploadcare_hosts"

module Uploadcare
  module Rails
    module Internal
      module ActiveStorageServiceHelpers
        include TrustedUploadcareHosts

        private

        def stream_download(key, download_url, &block)
          instrument :streaming_download, key: key do
            request(download_url) { |response| response.read_body(&block) }
          end
        end

        def file_download_url(uuid)
          file = @client.files.find(uuid: uuid)
          file.cdn_url
        end

        def file_exists?(key)
          uuid = uuid_for(key)
          return false unless uuid

          @client.files.find(uuid: uuid)
          true
        end

        def request(url, range: nil, &block)
          uri = parse_trusted_uploadcare_uri!(
            url,
            error_class: ::ActiveStorage::IntegrityError,
            label: "download",
            extra_hosts: trusted_active_storage_hosts
          )
          request = build_request(uri, range)

          Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
            configure_http_timeouts(http)
            return request_streaming(http, request, &block) if block

            request_once(http, request)
          end
        end

        def build_request(uri, range)
          request = Net::HTTP::Get.new(uri)
          request["Range"] = "bytes=#{range.begin}-#{range.end}" if range
          request
        end

        def request_streaming(http, request, &block)
          result = nil

          http.request(request) do |response|
            raise_for_response!(response)
            result = block.call(response)
          end

          result
        end

        def request_once(http, request)
          response = http.request(request)
          raise_for_response!(response)
          response
        end

        def raise_for_response!(response)
          raise ::ActiveStorage::FileNotFoundError if response.is_a?(Net::HTTPNotFound)

          response.value unless response.is_a?(Net::HTTPSuccess)
        end

        def ensure_integrity(io, checksum)
          io.rewind
          actual_checksum = Base64.strict_encode64(Digest::MD5.digest(io.read))
          raise ::ActiveStorage::IntegrityError unless actual_checksum == checksum
        ensure
          io.rewind
        end

        def configure_http_timeouts(http)
          http.open_timeout = 5 if http.respond_to?(:open_timeout=)
          http.read_timeout = 30 if http.respond_to?(:read_timeout=)
          http.write_timeout = 30 if http.respond_to?(:write_timeout=)
        end

        def trusted_active_storage_hosts
          [
            @cdn_hostname,
            @client.config.default_cdn_base,
            @client.config.cdn_base_postfix
          ]
        end
      end
    end
  end
end
