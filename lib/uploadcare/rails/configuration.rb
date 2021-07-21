require 'singleton'

module Uploadcare
  module Rails
    class Configuration
      include Singleton

      CONFIG_GLOBAL_PARAMS = %w[
        public_key locale live manual_start images_only preview_step crop image_shrink
        clearable tabs input_accept_types preferred_types system_dialog multipart_min_size
        locale locale_translations locale_pluralize secure_signature secure_expire preview_proxy
        preview_url_callback cdn_base do_not_store audio_bits_per_second video_preferred_mime_types
        video_bits_per_second camera_mirror_default
      ]

      attr_accessor *CONFIG_GLOBAL_PARAMS

      def widget_parameters
        CONFIG_GLOBAL_PARAMS.map do |param_name|
          param_value = instance_variable_get("@#{param_name}")
          next if param_value.nil?

          "UPLOADCARE_#{param_name.upcase} = '#{param_value}';"
        end.compact.join("\n")
      end
    end
  end
end
