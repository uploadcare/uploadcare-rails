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

          client_instance.config.to_h
        end

        def build_client_from_options(options = {})
          return client if options.blank?

          Uploadcare::Client.new(**options.symbolize_keys)
        end
      end
    end
  end
end
