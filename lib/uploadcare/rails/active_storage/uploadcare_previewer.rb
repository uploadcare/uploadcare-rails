# frozen_string_literal: true

require "active_storage/previewer"
require "marcel"
require "net/http"
require "tempfile"

module Uploadcare
  module Rails
    module ActiveStorage
      class UploadcarePreviewer < ::ActiveStorage::Previewer
        class << self
          def accept?(blob)
            !!(uploadcare_blob?(blob) && pdf?(blob.content_type))
          end

          def uploadcare_blob?(blob)
            blob.service.is_a?(::ActiveStorage::Service::UploadcareService)
          rescue NameError
            false
          end

          def pdf?(content_type)
            Marcel::Magic.child?(content_type, "application/pdf")
          end
        end

        def preview(**options)
          open_preview_io(preview_url) do |output|
            yield io: output, filename: "#{blob.filename.base}.png", content_type: "image/png", **options
          end
        end

        private

        def preview_url
          file = service_client.files.find(uuid: uploadcare_uuid)
          "#{file.cdn_url}-/document/-/format/png/-/page/1/"
        end

        def service_client
          blob.service.client
        end

        def uploadcare_uuid
          blob.metadata["uploadcare_uuid"].presence || blob.key
        end

        def open_preview_io(url)
          tempfile = Tempfile.open([ "uploadcare-preview", ".png" ], tmpdir)
          tempfile.binmode

          response = http_get(url)
          raise_preview_error(response) unless response.is_a?(Net::HTTPSuccess)

          tempfile.write(response.body)
          tempfile.rewind
          yield tempfile
        ensure
          tempfile&.close!
        end

        def raise_preview_error(response)
          raise ::ActiveStorage::PreviewError, "Uploadcare preview fetch failed: #{response.code}"
        end

        def http_get(url, limit = 5)
          raise ::ActiveStorage::PreviewError, "Uploadcare preview redirect limit exceeded" if limit.zero?

          uri = URI.parse(url)
          response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
            http.request(Net::HTTP::Get.new(uri))
          end

          return http_get(response["location"], limit - 1) if response.is_a?(Net::HTTPRedirection)

          response
        end
      end
    end
  end
end
