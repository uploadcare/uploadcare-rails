# frozen_string_literal: true

require "net/http"

module Uploadcare
  module Rails
    module Internal
      module RemoteHttpFetching
        private

        def fetch_http_response(url, limit:, error_class:, label:, wrap_transport_errors: false)
          raise error_class, "Uploadcare #{label} redirect limit exceeded" if limit.zero?

          uri = URI.parse(url)
          response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
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
              wrap_transport_errors: wrap_transport_errors
            )
          end

          response
        rescue Net::OpenTimeout, Net::ReadTimeout, Net::WriteTimeout, SocketError, EOFError,
               Errno::ECONNRESET, Errno::ECONNABORTED, OpenSSL::SSL::SSLError => e
          raise unless wrap_transport_errors

          raise error_class, "Uploadcare #{label} fetch failed: #{e.class}"
        end
      end
    end
  end
end
