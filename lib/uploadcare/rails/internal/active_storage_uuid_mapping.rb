# frozen_string_literal: true

module Uploadcare
  module Rails
    module Internal
      module ActiveStorageUuidMapping
        private

        def uuid_for!(key)
          uuid_for(key) || raise(::ActiveStorage::FileNotFoundError)
        end

        def uuid_for(key)
          @key_uuid_map[key] || uuid_from_blob(key) || key_if_uuid(key)
        end

        def persist_uuid_mapping(key, uuid)
          @key_uuid_map[key] = uuid
          persist_uuid_to_blob(key, uuid)
        end

        def uuid_from_blob(key)
          return unless defined?(::ActiveStorage::Blob)

          blob = ::ActiveStorage::Blob.find_by(key: key)
          blob&.metadata&.[]("uploadcare_uuid")
        end

        def persist_uuid_to_blob(key, uuid)
          return unless defined?(::ActiveStorage::Blob)

          blob = ::ActiveStorage::Blob.find_by(key: key)
          return unless blob

          metadata = (blob.metadata || {}).dup
          return if metadata["uploadcare_uuid"] == uuid

          metadata["uploadcare_uuid"] = uuid
          blob.update!(metadata: metadata)
        end

        def keys_for_prefix(prefix)
          if defined?(::ActiveStorage::Blob)
            sanitized_prefix = sanitize_sql_like_prefix(prefix)
            return ::ActiveStorage::Blob.where("key LIKE ?", "#{sanitized_prefix}%").pluck(:key)
          end

          @key_uuid_map.keys.select { |key| key.start_with?(prefix) }
        end

        def sanitize_sql_like_prefix(prefix)
          if defined?(::ActiveRecord::Base) && ::ActiveRecord::Base.respond_to?(:sanitize_sql_like)
            ::ActiveRecord::Base.sanitize_sql_like(prefix.to_s)
          else
            prefix.to_s.gsub(/[\\%_]/) { |char| "\\#{char}" }
          end
        end

        def key_if_uuid(key)
          key if key.to_s.match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i)
        end
      end
    end
  end
end
