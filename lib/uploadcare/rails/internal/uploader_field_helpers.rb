# frozen_string_literal: true

require "action_view"
require "uploadcare/rails/configuration"

module Uploadcare
  module Rails
    module Internal
      module UploaderFieldHelpers
        def uploadcare_file_field(object_name, method_name, ctx_name: nil, solution: "regular", **options)
          object = instance_variable_get("@#{object_name}")

          unless options.key?(:multiple)
            options[:multiple] = true if uploadcare_file_group_attribute?(object_name, method_name)
          end

          ctx_name ||= SecureRandom.uuid
          field_name = "#{object_name}[#{method_name}]"
          field_html = uploadcare_file_field_tag(field_name, ctx_name: ctx_name, solution: solution, **options)

          if uploadcare_object_has_errors?(object, method_name)
            uploadcare_error_wrapping(field_html)
          else
            field_html
          end
        end

        def uploadcare_file_field_tag(name, ctx_name: nil, solution: "regular", **options)
          ctx_name ||= SecureRandom.uuid

          form_input = uploadcare_form_input_tag(name: name, ctx_name: ctx_name)
          uploader = uploadcare_uploader(ctx_name: ctx_name, solution: solution, **options)

          safe_join([ form_input, uploader ])
        end

        def uploadcare_files_field(object_name, method_name, ctx_name: nil, solution: "regular", **options)
          uploadcare_file_field(
            object_name,
            method_name,
            ctx_name: ctx_name,
            solution: solution,
            **{ multiple: true, group_output: true }.merge(options)
          )
        end

        def uploadcare_files_field_tag(name, ctx_name: nil, solution: "regular", **options)
          uploadcare_file_field_tag(
            name,
            ctx_name: ctx_name,
            solution: solution,
            **{ multiple: true, group_output: true }.merge(options)
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

          normalize_key = ->(key) { key.to_s.tr("_", "-").to_sym }

          attributes = default_options
            .transform_keys(&normalize_key)
            .merge(options.transform_keys(&normalize_key))
            .transform_keys(&:to_s)
            .transform_values { |value| value.is_a?(TrueClass) || value.is_a?(FalseClass) ? value.to_s : value }
          attributes["ctx-name"] = ctx_name

          "<uc-config#{tag_builder.tag_options(attributes, true)}></uc-config>".html_safe
        end

        def uploadcare_uploader_tag(ctx_name:, solution: "regular")
          content_tag("uc-file-uploader-#{solution}", "", "ctx-name": ctx_name)
        end

        def uploadcare_ctx_provider_tag(ctx_name:)
          content_tag("uc-upload-ctx-provider", "", "ctx-name": ctx_name)
        end

        def uploadcare_form_input_tag(name: nil, ctx_name:)
          options = { "ctx-name": ctx_name }
          options[:name] = name if name
          content_tag("uc-form-input", "", options)
        end

        def uploadcare_file_group_attribute?(object_name, method_name)
          model = object_name.to_s.camelize.safe_constantize
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
