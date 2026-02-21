# frozen_string_literal: true

module ActiveStorage
  class Service
    class UploadcareService < Service
      # UUID lookup and persistence helpers for key-to-file mapping.
      module UuidMapping
        private

        def uuid_for!(key)
          uuid_for(key) || raise(ActiveStorage::FileNotFoundError)
        end

        def uuid_for(key)
          @key_uuid_map[key] || uuid_from_blob(key) || key_if_uuid(key)
        end

        def persist_uuid_mapping(key, uuid)
          @key_uuid_map[key] = uuid
          persist_uuid_to_blob(key, uuid)
        end

        def uuid_from_blob(key)
          return unless defined?(ActiveStorage::Blob)

          blob = ActiveStorage::Blob.find_by(key: key)
          blob&.metadata&.[]('uploadcare_uuid')
        end

        def persist_uuid_to_blob(key, uuid)
          return unless defined?(ActiveStorage::Blob)

          blob = ActiveStorage::Blob.find_by(key: key)
          return unless blob

          metadata = (blob.metadata || {}).dup
          return if metadata['uploadcare_uuid'] == uuid

          metadata['uploadcare_uuid'] = uuid
          blob.update!(metadata: metadata)
        end

        def keys_for_prefix(prefix)
          return ActiveStorage::Blob.where('key LIKE ?', "#{prefix}%").pluck(:key) if defined?(ActiveStorage::Blob)

          @key_uuid_map.keys.select { |key| key.start_with?(prefix) }
        end

        def key_if_uuid(key)
          key if key.to_s.match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i)
        end
      end
    end
  end
end
