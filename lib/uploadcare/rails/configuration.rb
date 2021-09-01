# frozen_string_literal: true

require 'singleton'

module Uploadcare
  module Rails
    # A class for storing config parameters
    class Configuration
      include Singleton

      CONFIG_GLOBAL_PARAMS = %w[
        public_key locale live manual_start images_only preview_step crop image_shrink
        clearable tabs input_accept_types preferred_types system_dialog multipart_min_size
        locale_translations locale_pluralize secure_signature secure_expire preview_proxy
        preview_url_callback cdn_base do_not_store audio_bits_per_second video_preferred_mime_types
        video_bits_per_second camera_mirror_default
      ].freeze

      attr_accessor(
        :cache_files, :store_files_after_save, :delete_files_after_destroy,
        :cache_namespace, :store_files_async, :delete_files_async,
        *CONFIG_GLOBAL_PARAMS
      )

      def widget_parameters
        CONFIG_GLOBAL_PARAMS.map do |param_name|
          param_value = instance_variable_get("@#{param_name}")
          next if param_value.nil?

          param_value = handle_param_value(param_value)
          "UPLOADCARE_#{param_name.upcase} = #{param_value};"
        end.compact.join("\n")
      end

      private

      def handle_param_value(param_value)
        case param_value
        when Hash
          param_value.deep_stringify_keys.to_s.tr('=>', ': ')
        when TrueClass, FalseClass
          param_value
        else
          "'#{param_value}'"
        end
      end
    end
  end
end
