# frozen_string_literal: true

module Uploadcare
  module Rails
    class Configuration
      RAILS_PARAMS = %w[
        public_key secret_key
        cache_files cache_expires_in cache_namespace cdn_hostname
        store_files_after_save store_files_async
        delete_files_after_destroy delete_files_async
        job_queue
      ].freeze

      FILE_UPLOADER_PARAMS = %w[
        public_key
        multiple
        img_only
        accept
        external_sources_preferred_types
        store
        camera_mirror
        source_list
        max_local_file_size_bytes
        cdn_cname
        base_url
        social_base_url
        secure_signature
        secure_expire
        secure_delivery_proxy
        retry_throttled_request_max_count
        multipart_min_file_size
        multipart_chunk_size
        max_concurrent_requests
        multipart_max_attempts
        check_for_url_duplicates
        save_url_for_recurrent_uploads
        group_output
        locale
        metadata
        remove_copyright
        crop_preset
        image_shrink
      ].freeze

      attr_accessor(*(RAILS_PARAMS + FILE_UPLOADER_PARAMS).uniq)

      def initialize(source = nil)
        @cache_files = false
        @cache_expires_in = 300
        @store_files_after_save = false
        @store_files_async = false
        @delete_files_after_destroy = false
        @delete_files_async = false
        apply(source)
      end

      def uploader_config_attributes
        attrs = {}

        FILE_UPLOADER_PARAMS.each do |param_name|
          param_value = instance_variable_get("@#{param_name}")
          next if param_value.nil?

          attr_name = if param_name == "public_key"
                        :pubkey
          else
                        param_name.tr("_", "-").to_sym
          end

          attrs[attr_name] = format_config_value(param_value)
        end

        attrs
      end

      private

      def apply(source)
        return if source.nil?

        source.each do |key, value|
          setter = "#{key}="
          public_send(setter, value) if respond_to?(setter)
        end
      end

      def format_config_value(param_value)
        case param_value
        when Hash
          param_value.to_json
        when Array
          param_value.join(",")
        when TrueClass, FalseClass
          param_value
        else
          param_value.to_s
        end
      end
    end
  end
end
