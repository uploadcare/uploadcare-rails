# frozen_string_literal: true

require 'singleton'

module Uploadcare
  module Rails
    # A class for storing config parameters
    class Configuration
      include Singleton

      # Parameters used by backend integration.
      # @return [Array<String>]
      CONFIG_GLOBAL_PARAMS = %w[
        public_key secret_key cache_files cache_expires_in cache_namespace cdn_hostname
        store_files_after_save store_files_async
        delete_files_after_destroy delete_files_async
      ].freeze

      # Parameters passed to the Uploadcare widget.
      # @return [Array<String>]
      WIDGET_PARAMS = %w[
        public_key images_only preview_step crop image_shrink
        clearable tabs input_accept_types preferred_types system_dialog multipart_min_size
        preview_proxy cdn_base do_not_store audio_bits_per_second video_preferred_mime_types
        video_bits_per_second camera_mirror_default live manual_start
        locale locale_translations locale_pluralize
      ].freeze

      attr_accessor(*(CONFIG_GLOBAL_PARAMS + WIDGET_PARAMS).uniq)

      # Builds widget initialization JavaScript snippet.
      # @return [String]
      def uploader_parameters
        WIDGET_PARAMS.map do |param_name|
          param_value = instance_variable_get("@#{param_name}")
          next if param_value.nil?

          param_value = handle_param_value(param_value)
          "UPLOADCARE_#{param_name.upcase} = #{param_value};"
        end.compact.join("\n")
      end

      # Returns widget config as a simple struct.
      # @return [Struct]
      def widget
        Struct
          .new(WIDGET_PARAMS)
          .new(WIDGET_PARAMS.map { |param| public_send(param) })
      end

      private

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
