# frozen_string_literal: true

require "net/http"
require "tempfile"

module Uploadcare
  module Rails
    module ActiveStorage
      module VariantRemoteProcessing
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

          response = http_get(variant_source_url)
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
          blob.metadata["uploadcare_uuid"].presence || blob.key
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

        def http_get(url, limit = 5)
          raise ::ActiveStorage::IntegrityError, "Uploadcare variant redirect limit exceeded" if limit.zero?

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
