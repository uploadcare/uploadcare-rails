# frozen_string_literal: true

module ActiveStorage
  class Service
    class UploadcareService < Service
      module Helpers
        private

        def stream_download(key, download_url, &block)
          instrument :streaming_download, key: key do
            request(download_url) { |response| response.read_body(&block) }
          end
        end

        def file_download_url(uuid)
          file = @client.files.find(uuid: uuid)
          file.original_file_url || file.cdn_url
        end

        def file_exists?(key)
          uuid = uuid_for(key)
          return false unless uuid

          @client.files.find(uuid: uuid)
          true
        end

        def request(url, range: nil, &block)
          uri = URI.parse(url)
          request = build_request(uri, range)

          Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
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
          http.request(request) do |response|
            raise_not_found!(response)
            block.call(response)
          end
        end

        def request_once(http, request)
          response = http.request(request)
          raise_not_found!(response)
          response
        end

        def raise_not_found!(response)
          raise ActiveStorage::FileNotFoundError if response.is_a?(Net::HTTPNotFound)
        end

        def ensure_integrity(io, checksum)
          io.rewind
          actual_checksum = Base64.strict_encode64(Digest::MD5.digest(io.read))
          raise ActiveStorage::IntegrityError unless actual_checksum == checksum
        ensure
          io.rewind
        end
      end
    end
  end
end
