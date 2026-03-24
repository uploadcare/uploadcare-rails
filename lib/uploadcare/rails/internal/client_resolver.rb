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
      end
    end
  end
end
