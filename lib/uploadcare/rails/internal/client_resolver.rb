# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      module ClientResolver
        def resolve_client(client_or_options = nil)
          case client_or_options
          when Uploadcare::Client
            client_or_options
          when Hash
            client(**client_or_options.symbolize_keys)
          else
            client
          end
        end

        def serialize_client_options(client_instance)
          return {} unless client_instance

          config = client_instance.config

          # Async jobs need per-account credentials so tenant-scoped clients can be rebuilt at perform time.
          # Keep the payload limited to the keys required to reconstruct that client.
          {
            public_key: config.public_key,
            secret_key: config.secret_key
          }.compact
        end

        def build_client_from_options(options = {})
          return client if options.blank?

          client(**options.symbolize_keys)
        end
      end
    end
  end
end
