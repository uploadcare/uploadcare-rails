# frozen_string_literal: true

require "uri"

module Uploadcare
  module Rails
    module Internal
      module TrustedUploadcareHosts
        private

        def parse_trusted_uploadcare_uri!(url, error_class:, label:, extra_hosts: [])
          uri = URI.parse(url)
          validate_trusted_uploadcare_uri!(uri, error_class: error_class, label: label, extra_hosts: extra_hosts)
          uri
        rescue URI::InvalidURIError
          raise error_class, "Uploadcare #{label} URL is invalid"
        end

        def validate_trusted_uploadcare_uri!(uri, error_class:, label:, extra_hosts: [])
          unless uri.is_a?(URI::HTTPS) && trusted_uploadcare_hosts(extra_hosts).include?(normalize_uploadcare_host(uri.host))
            raise error_class, "Uploadcare #{label} URL is not trusted"
          end
        end

        def trusted_uploadcare_hosts(extra_hosts = [])
          ([ Uploadcare::Rails.configuration.cdn_hostname, "ucarecdn.com" ] + Array(extra_hosts))
            .filter_map { |host| normalize_uploadcare_host(host) }
            .uniq
        end

        def normalize_uploadcare_host(host)
          value = host.to_s
          normalized = if value.include?("://")
                         URI.parse(value).host.to_s.downcase
          else
                         value.downcase
          end
          normalized.presence
        rescue URI::InvalidURIError
          nil
        end
      end
    end
  end
end
