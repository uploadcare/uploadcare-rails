# frozen_string_literal: true

require "action_view"

module ActionView
  module Helpers
    class FormBuilder
      def uploadcare_file_field(method, ctx_name: nil, solution: "regular", **options)
        unless options.key?(:multiple)
          model = object&.class || object_name.to_s.camelize.safe_constantize
          if model
            checker = "has_uploadcare_files_for_#{method}?"
            options[:multiple] = true if model.respond_to?(checker) && model.public_send(checker)
          end
        end

        ctx_name ||= SecureRandom.uuid
        field_name = "#{object_name}[#{method}]"
        options[:value] = object.public_send(method) if !options.key?(:value) && object&.respond_to?(method)

        field_html = @template.uploadcare_file_field_tag(
          field_name,
          ctx_name: ctx_name,
          solution: solution,
          **options
        )

        if object && uploadcare_object_has_errors?(method)
          uploadcare_error_wrapping(field_html)
        else
          field_html
        end
      end

      def uploadcare_files_field(method, ctx_name: nil, solution: "regular", **options)
        uploadcare_file_field(
          method,
          ctx_name: ctx_name,
          solution: solution,
          **uploadcare_group_field_options(options)
        )
      end

      private

      def uploadcare_group_field_options(options)
        { multiple: true, group_output: true }.merge(options)
      end

      def uploadcare_object_has_errors?(method)
        return false unless object.respond_to?(:errors)
        return false unless object.errors.respond_to?(:[])

        object.errors[method].present?
      end

      def uploadcare_error_wrapping(html_tag)
        @template.instance_exec(html_tag, self, &::ActionView::Base.field_error_proc)
      end
    end
  end
end
