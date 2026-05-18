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
          file_cdn_url(uuid)
        end

        def file_cdn_url(uuid)
          base = @client.config.default_cdn_base.presence ||
                 @client.config.cdn_base_postfix.presence ||
                 "https://ucarecdn.com/"
          base = "#{base}/" unless base.end_with?("/")

          "#{base}#{uuid}/"
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
          request["Range"] = range_header(range) if range
          request
        end

        def range_header(range)
          range_end = range.end
          range_end -= 1 if range_end && range.exclude_end?

          if range_end && range.begin && range_end < range.begin
            raise ArgumentError, "range end must be greater than or equal to range begin"
          end

          range_end ? "bytes=#{range.begin}-#{range_end}" : "bytes=#{range.begin}-"
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
          open_timeout = respond_to?(:http_open_timeout, true) ? send(:http_open_timeout) : 5
          read_timeout = respond_to?(:http_read_timeout, true) ? send(:http_read_timeout) : 30
          write_timeout = respond_to?(:http_write_timeout, true) ? send(:http_write_timeout) : 30

          http.open_timeout = open_timeout if http.respond_to?(:open_timeout=) && !open_timeout.nil?
          http.read_timeout = read_timeout if http.respond_to?(:read_timeout=) && !read_timeout.nil?
          http.write_timeout = write_timeout if http.respond_to?(:write_timeout=) && !write_timeout.nil?
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
