require 'singleton'

module Uploadcare
  module Rails
    class Configuration
      include Singleton

      PARAM_NAME_MAP = {
        'signature_lifetime' => 'secure_expire'
      }.freeze
      WIDGET_PARAMS = %w[
        public_key images_only preview_step crop image_shrink
        clearable tabs input_accept_types preferred_types system_dialog multipart_min_size
        signature_lifetime preview_proxy
        cdn_base do_not_store audio_bits_per_second video_preferred_mime_types
        video_bits_per_second camera_mirror_default
      ]
      CONFIG_GLOBAL_PARAMS = %w[
        locale locale_translations locale_pluralize live manual_start
      ]

      attr_accessor *(CONFIG_GLOBAL_PARAMS + WIDGET_PARAMS)

      def uploader_parameters
        (CONFIG_GLOBAL_PARAMS + WIDGET_PARAMS).map do |param_name|
          mapped_name = PARAM_NAME_MAP[param_name] || param_name
          param_value = instance_variable_get("@#{mapped_name}")
          next if param_value.nil?

          param_value = handle_param_value(param_value)
          "UPLOADCARE_#{mapped_name.upcase} = #{param_value};"
        end.compact.join("\n")
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
