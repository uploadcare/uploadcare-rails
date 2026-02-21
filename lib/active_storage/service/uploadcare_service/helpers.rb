# frozen_string_literal: true

module ActiveStorage
  # Service implementations for ActiveStorage.
  class Service
    class UploadcareService < Service
      # Shared helper methods for Uploadcare service operations.
      module Helpers
        private

        def stream_download(key, download_url, &block)
          instrument :streaming_download, key: key do
            request(download_url) { |response| response.read_body(&block) }
          end
        end

        def file_download_url(uuid)
          file = Uploadcare::File.info(uuid: uuid, config: @client_config)
          file.original_file_url || file.cdn_url
        end

        def file_exists?(key)
          uuid = uuid_for(key)
          return false unless uuid

          Uploadcare::File.info(uuid: uuid, config: @client_config)
          true
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
      end
    end
  end
end
