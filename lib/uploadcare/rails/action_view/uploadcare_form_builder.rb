# frozen_string_literal: true

require "action_view"

# FormBuilder integration for Uploadcare File Uploader.
# Adds uploadcare_file method to Rails FormBuilder for use with form_with/form_for.
#
# Example:
#   <%= form_with model: @user do |f| %>
#     <%= f.uploadcare_file :avatar %>
#     <%= f.uploadcare_file :photos, multiple: true, solution: "inline" %>
#   <% end %>
#
# When the model has validation errors on the field, the uploader will be
# wrapped according to ActionView::Base.field_error_proc (by default:
# <div class="field_with_errors">...</div>)
module ActionView
  module Helpers
    class FormBuilder
      # Generates an Uploadcare File Uploader field bound to the form's model.
      # Automatically handles validation error wrapping.
      #
      # @param method [Symbol] the attribute name on the model
      # @param ctx_name [String, nil] optional context name for linking uploader components
      # @param solution [String] uploader solution type: "regular", "inline", or "minimal"
      # @param options [Hash] additional options passed to uploadcare_config_tag
      # @return [ActiveSupport::SafeBuffer] the rendered uploader HTML
      #
      # @example Basic usage
      #   <%= f.uploadcare_file :avatar %>
      #
      # @example With options
      #   <%= f.uploadcare_file :document, multiple: true, accept: "application/pdf" %>
      #
      # @example With inline solution
      #   <%= f.uploadcare_file :photos, solution: "inline" %>
      def uploadcare_file(method, ctx_name: nil, solution: "regular", **options)
        # Auto-detect multiple from mount_uploadcare_file_group unless explicitly set
        unless options.key?(:multiple)
          model = object_name.to_s.camelize.safe_constantize
          if model
            checker = "has_uploadcare_file_group_for_#{method}?"
            options[:multiple] = true if model.respond_to?(checker) && model.public_send(checker)
          end
        end

        ctx_name ||= SecureRandom.uuid
        field_name = "#{object_name}[#{method}]"

        # Generate the uploader field using the template's helper
        field_html = @template.uploadcare_uploader_field_tag(
          field_name,
          ctx_name: ctx_name,
          solution: solution,
          **options
        )

        # Apply error wrapping if object has validation errors on this method
        if object && uploadcare_object_has_errors?(method)
          uploadcare_error_wrapping(field_html)
        else
          field_html
        end
      end

      private

      # Check if the form's object has validation errors on the given method
      def uploadcare_object_has_errors?(method)
        return false unless object.respond_to?(:errors)
        return false unless object.errors.respond_to?(:[])

        object.errors[method].present?
      end

      # Wrap the HTML with the field_error_proc
      def uploadcare_error_wrapping(html_tag)
        @template.instance_exec(html_tag, self, &::ActionView::Base.field_error_proc)
      end
    end
  end
end
