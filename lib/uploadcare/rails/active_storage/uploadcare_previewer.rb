# frozen_string_literal: true

require "active_storage/previewer"
require "marcel"
require "tempfile"
require "uploadcare/rails/internal/remote_http_fetching"

module Uploadcare
  module Rails
    module ActiveStorage
      class UploadcarePreviewer < ::ActiveStorage::Previewer
        include Uploadcare::Rails::Internal::RemoteHttpFetching

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
          blob.service.send(:uuid_for, blob.key)
        end

        def open_preview_io(url)
          tempfile = Tempfile.open([ "uploadcare-preview", ".png" ], tmpdir)
          tempfile.binmode

          response = fetch_http_response(url, limit: 5, error_class: ::ActiveStorage::PreviewError, label: "preview")
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

        def fetch_http_response(url, limit:, error_class:, label:, wrap_transport_errors: false, extra_hosts: [])
          super(
            url,
            limit: limit,
            error_class: error_class,
            label: label,
            wrap_transport_errors: wrap_transport_errors,
            extra_hosts: Array(extra_hosts) + trusted_preview_hosts
          )
        end

        def trusted_preview_hosts
          [
            service_client.config.default_cdn_base,
            service_client.config.cdn_base_postfix
          ]
        end
      end
    end
  end
end
