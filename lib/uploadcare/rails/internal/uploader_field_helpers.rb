# frozen_string_literal: true

require "action_view"
require "json"
require "set"

module Uploadcare
  module Rails
    module Internal
      module UploaderFieldHelpers
        def uploadcare_file_field(object_name, method_name, ctx_name: nil, solution: "regular", **options)
          object = instance_variable_get("@#{object_name}")

          unless options.key?(:multiple)
            options[:multiple] = true if uploadcare_file_group_attribute?(object_name, method_name, object: object)
          end

          ctx_name ||= SecureRandom.uuid
          field_name = "#{object_name}[#{method_name}]"
          options[:value] = object.public_send(method_name) if !options.key?(:value) && object&.respond_to?(method_name)
          field_html = uploadcare_file_field_tag(field_name, ctx_name: ctx_name, solution: solution, **options)

          if uploadcare_object_has_errors?(object, method_name)
            uploadcare_error_wrapping(field_html)
          else
            field_html
          end
        end

        def uploadcare_file_field_tag(name, ctx_name: nil, solution: "regular", **options)
          ctx_name ||= SecureRandom.uuid
          value = options.delete(:value)

          form_input = uploadcare_form_input_tag(name: name, ctx_name: ctx_name, value: value)
          uploader = uploadcare_uploader(ctx_name: ctx_name, solution: solution, **options)

          safe_join([ form_input, uploader ])
        end

        def uploadcare_files_field(object_name, method_name, ctx_name: nil, solution: "regular", **options)
          uploadcare_file_field(
            object_name,
            method_name,
            ctx_name: ctx_name,
            solution: solution,
            **uploadcare_group_field_options(options)
          )
        end

        def uploadcare_files_field_tag(name, ctx_name: nil, solution: "regular", **options)
          uploadcare_file_field_tag(
            name,
            ctx_name: ctx_name,
            solution: solution,
            **uploadcare_group_field_options(options)
          )
        end

        private

        def uploadcare_uploader(ctx_name:, solution: "regular", **options)
          ctx_name ||= SecureRandom.uuid

          config = uploadcare_config_tag(ctx_name: ctx_name, **options)
          uploader = uploadcare_uploader_tag(ctx_name: ctx_name, solution: solution)
          ctx_provider = uploadcare_ctx_provider_tag(ctx_name: ctx_name)

          safe_join([ config, uploader, ctx_provider ])
        end

        def uploadcare_config_tag(ctx_name:, **options)
          default_options = Uploadcare::Rails.configuration.uploader_config_attributes

          normalize_key = lambda do |key|
            attr_name = key.to_s.tr("_", "-")
            attr_name == "public-key" ? :pubkey : attr_name.to_sym
          end
          normalized_options = options.transform_keys(&normalize_key)
          filtered_options = filter_uploader_config_options(normalized_options)

          attributes = default_options
            .transform_keys(&normalize_key)
            .merge(filtered_options)
            .transform_keys(&:to_s)
            .transform_values { |value| value.is_a?(TrueClass) || value.is_a?(FalseClass) ? value.to_s : value }
          attributes["ctx-name"] = ctx_name

          "<uc-config#{tag_builder.tag_options(attributes, true)}></uc-config>".html_safe
        end

        def filter_uploader_config_options(options)
          allowed = Uploadcare::Rails::Configuration::FILE_UPLOADER_PARAMS.to_set do |param|
            param.to_s.tr("_", "-").to_sym
          end
          allowed << :pubkey

          data_attributes = extract_data_attributes(options)
          unknown_keys = options.keys - allowed.to_a - data_attributes[:consumed_keys]
          warn_unknown_uploader_options(unknown_keys) if unknown_keys.any?

          options
            .slice(*allowed.to_a)
            .transform_values { |value| format_uploader_config_value(value) }
            .merge(data_attributes[:attributes])
        end

        def format_uploader_config_value(value)
          case value
          when Hash
            JSON.generate(value)
          when Array
            value.join(",")
          else
            value
          end
        end

        def extract_data_attributes(options)
          attributes = options.select { |key, _| key.to_s.start_with?("data-") }
          consumed_keys = attributes.keys.dup

          raw_data = options[:data]
          if raw_data.is_a?(Hash)
            raw_data.each do |key, value|
              attributes[:"data-#{key.to_s.tr('_', '-')}"] = value
            end
            consumed_keys << :data
          end

          { attributes: attributes, consumed_keys: consumed_keys }
        end

        def warn_unknown_uploader_options(keys)
          message = "Uploadcare::Rails uploader ignored unknown options: #{keys.map(&:to_s).sort.join(', ')}"
          logger = defined?(::Rails) && ::Rails.respond_to?(:logger) ? ::Rails.logger : nil

          if logger
            logger.warn(message)
          else
            warn(message)
          end
        end

        def uploadcare_uploader_tag(ctx_name:, solution: "regular")
          content_tag("uc-file-uploader-#{solution}", "", "ctx-name": ctx_name)
        end

        def uploadcare_group_field_options(options)
          { multiple: true, group_output: true }.merge(options)
        end

        def uploadcare_ctx_provider_tag(ctx_name:)
          content_tag("uc-upload-ctx-provider", "", "ctx-name": ctx_name)
        end

        def uploadcare_form_input_tag(name: nil, ctx_name:, value: nil)
          options = { "ctx-name": ctx_name }
          options[:name] = name if name
          options[:value] = value if value.present?
          content_tag("uc-form-input", "", options)
        end

        def uploadcare_file_group_attribute?(object_name, method_name, object: nil)
          model = object_name.to_s.camelize.safe_constantize || object&.class
          return false unless model

          checker = "has_uploadcare_files_for_#{method_name}?"
          model.respond_to?(checker) && model.public_send(checker)
        end

        def uploadcare_object_has_errors?(object, method_name)
          return false unless object.respond_to?(:errors)
          return false unless object.errors.respond_to?(:[])

          object.errors[method_name].present?
        end

        def uploadcare_error_wrapping(html_tag)
          instance_exec(html_tag, self, &::ActionView::Base.field_error_proc)
        end
      end
    end
  end
end
