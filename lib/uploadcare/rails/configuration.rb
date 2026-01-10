# frozen_string_literal: true

require "singleton"

module Uploadcare
  module Rails
    # A class for storing config parameters
    class Configuration
      include Singleton

      # Global gem configuration parameters
      CONFIG_GLOBAL_PARAMS = %w[
        public_key secret_key cache_files cache_expires_in cache_namespace cdn_hostname
        store_files_after_save store_files_async
        delete_files_after_destroy delete_files_async
      ].freeze

      # File Uploader configuration parameters
      # See https://uploadcare.com/docs/file-uploader/configuration/ for details
      #
      # These parameters map to uc-config attributes:
      #   Ruby snake_case => HTML kebab-case
      #   Example: img_only => img-only, source_list => source-list
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

      # Legacy widget parameters (deprecated, kept for backward compatibility)
      WIDGET_PARAMS = %w[
        public_key images_only preview_step crop image_shrink
        clearable tabs input_accept_types preferred_types system_dialog multipart_min_size
        preview_proxy cdn_base do_not_store audio_bits_per_second video_preferred_mime_types
        video_bits_per_second camera_mirror_default live manual_start
        locale locale_translations locale_pluralize
      ].freeze

      attr_accessor(*(CONFIG_GLOBAL_PARAMS + FILE_UPLOADER_PARAMS + WIDGET_PARAMS).uniq)

      # Returns configuration attributes for the uc-config element
      # All parameters are converted from snake_case to kebab-case
      def uploader_config_attributes
        attrs = {}

        FILE_UPLOADER_PARAMS.each do |param_name|
          param_value = instance_variable_get("@#{param_name}")
          next if param_value.nil?

          # Convert snake_case to kebab-case for HTML attributes
          # Special case: public_key => pubkey
          attr_name = if param_name == "public_key"
                        :pubkey
          else
                        param_name.tr("_", "-").to_sym
          end

          attrs[attr_name] = format_config_value(param_value)
        end

        attrs
      end

      # Legacy method for backward compatibility with old widget
      # @deprecated Use uploader_config_attributes instead
      def uploader_parameters
        WIDGET_PARAMS.map do |param_name|
          param_value = instance_variable_get("@#{param_name}")
          next if param_value.nil?

          param_value = handle_param_value(param_value)
          "UPLOADCARE_#{param_name.upcase} = #{param_value};"
        end.compact.join("\n")
      end

      # @deprecated Use uploader_config_attributes instead
      def widget
        Struct
          .new(*WIDGET_PARAMS.map(&:to_sym))
          .new(*WIDGET_PARAMS.map { |param| public_send(param) })
      end

      private

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

      # Legacy method for backward compatibility
      def handle_param_value(param_value)
        case param_value
        when Hash
          param_value.deep_stringify_keys.to_json
        when Array
          "'#{param_value.join(' ')}'"
        when TrueClass, FalseClass
          param_value
        else
          "'#{param_value}'"
        end
      end
    end
  end
end
