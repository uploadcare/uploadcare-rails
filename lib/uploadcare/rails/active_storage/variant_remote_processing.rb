# frozen_string_literal: true

require "tempfile"
require "uploadcare/rails/internal/remote_http_fetching"

module Uploadcare
  module Rails
    module ActiveStorage
      module VariantRemoteProcessing
        include Uploadcare::Rails::Internal::RemoteHttpFetching

        private

        def process
          return super unless uploadcare_service?(service)

          download_transformed_uploadcare_image do |output|
            service.upload(key, output, content_type: content_type)
          end
        end

        def uploadcare_service?(service_object)
          service_object.is_a?(::ActiveStorage::Service::UploadcareService)
        rescue NameError
          false
        end

        def download_transformed_uploadcare_image
          tempfile = Tempfile.open([ "uploadcare-variant", ".#{variation.format}" ], Dir.tmpdir)
          tempfile.binmode

          response = fetch_http_response(
            variant_source_url,
            limit: 5,
            error_class: ::ActiveStorage::IntegrityError,
            label: "variant",
            wrap_transport_errors: true
          )
          raise_integrity_error(response) unless response.is_a?(Net::HTTPSuccess)

          tempfile.write(response.body)
          tempfile.rewind
          yield tempfile
        ensure
          tempfile&.close!
        end

        def variant_source_url
          file = Uploadcare::Rails::AttachedFile.new({ uuid: uploadcare_uuid, cdn_url: uploadcare_cdn_url }, client: service_client)
          file.transform_url(uploadcare_transformations)
        end

        def service_client
          blob.service.client
        end

        def uploadcare_uuid
          service.send(:uuid_for, blob.key)
        end

        def uploadcare_cdn_url
          file = service_client.files.find(uuid: uploadcare_uuid)
          file.cdn_url
        end

        def uploadcare_transformations
          mapped = variation.transformations.deep_symbolize_keys.except(:format)
          map_resize!(mapped, mapped.delete(:resize_to_fit))
          map_resize!(mapped, mapped.delete(:resize_to_limit))
          map_scale_crop!(mapped, mapped.delete(:resize_to_fill))

          mapped
        end

        def map_resize!(mapped, dimensions)
          return if dimensions.blank?

          width, height = dimensions
          mapped[:resize] = [ width, height ].compact.join("x")
        end

        def map_scale_crop!(mapped, dimensions)
          return if dimensions.blank?

          width, height = dimensions
          mapped[:scale_crop] = {
            dimensions: [ width, height ].compact.join("x"),
            offsets: "50%,50%"
          }
        end

        def raise_integrity_error(response)
          raise ::ActiveStorage::IntegrityError, "Uploadcare variant fetch failed: #{response.code}"
        end

        def fetch_http_response(url, limit:, error_class:, label:, wrap_transport_errors: false, extra_hosts: [])
          super(
            url,
            limit: limit,
            error_class: error_class,
            label: label,
            wrap_transport_errors: wrap_transport_errors,
            extra_hosts: Array(extra_hosts) + trusted_variant_hosts
          )
        end

        def trusted_variant_hosts
          [
            service_client.config.default_cdn_base,
            service_client.config.cdn_base_postfix
          ]
        end
      end
    end
  end
end
