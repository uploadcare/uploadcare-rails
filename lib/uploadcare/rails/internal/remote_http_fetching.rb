# frozen_string_literal: true

require "net/http"
require "uploadcare/rails/internal/trusted_uploadcare_hosts"

module Uploadcare
  module Rails
    module Internal
      module RemoteHttpFetching
        include TrustedUploadcareHosts

        private

        def fetch_http_response(url, limit:, error_class:, label:, wrap_transport_errors: false, extra_hosts: [])
          raise error_class, "Uploadcare #{label} redirect limit exceeded" if limit.zero?

          uri = parse_trusted_uploadcare_uri!(url, error_class: error_class, label: label, extra_hosts: extra_hosts)
          response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
            http.open_timeout = uploadcare_http_open_timeout if http.respond_to?(:open_timeout=)
            http.read_timeout = uploadcare_http_read_timeout if http.respond_to?(:read_timeout=)
            http.write_timeout = uploadcare_http_write_timeout if http.respond_to?(:write_timeout=)
            http.request(Net::HTTP::Get.new(uri))
          end

          if response.is_a?(Net::HTTPRedirection)
            location = response["location"]
            raise error_class, "Uploadcare #{label} redirect is missing a Location header" if location.blank?

            return fetch_http_response(
              URI.join(url, location).to_s,
              limit: limit - 1,
              error_class: error_class,
              label: label,
              wrap_transport_errors: wrap_transport_errors,
              extra_hosts: extra_hosts
            )
          end

          response
        rescue Net::OpenTimeout, Net::ReadTimeout, Net::WriteTimeout, SocketError, EOFError,
               Errno::ECONNRESET, Errno::ECONNABORTED, OpenSSL::SSL::SSLError => e
          raise unless wrap_transport_errors

          raise error_class, "Uploadcare #{label} fetch failed: #{e.class}"
        end

        def uploadcare_http_open_timeout
          uploadcare_http_timeout_value(:http_open_timeout, default: 5)
        end

        def uploadcare_http_read_timeout
          uploadcare_http_timeout_value(:http_read_timeout, default: 30)
        end

        def uploadcare_http_write_timeout
          uploadcare_http_timeout_value(:http_write_timeout, default: 30)
        end

        def uploadcare_http_timeout_value(name, default:)
          if respond_to?(name, true)
            value = send(name)
            return value unless value.nil?
          end

          default
        end
      end
    end
  end
end
