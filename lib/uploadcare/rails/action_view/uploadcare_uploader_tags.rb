# frozen_string_literal: true

require "action_view"
require "uploadcare/rails/configuration"

module Uploadcare
  module Rails
    module ActionView
      # A module containing view helpers for Uploadcare File Uploader components.
      # These helpers can be used directly in views without a form builder.
      #
      # For FormBuilder integration (f.uploadcare_file), see uploadcare_form_builder.rb
      module UploadcareUploaderTags
        # A view helper to add a File Uploader component bound to a model attribute.
        # This helper retrieves the model object and applies validation error wrapping.
        # See https://uploadcare.com/docs/file-uploader/ for more info.
        #
        # @param object_name [Symbol, String] the name of the model (e.g., :user)
        # @param method_name [Symbol, String] the attribute name (e.g., :avatar)
        # @param ctx_name [String, nil] optional context name for linking uploader components
        # @param solution [String] uploader solution type: "regular", "inline", or "minimal"
        # @param options [Hash] additional options passed to uploadcare_config_tag
        # @return [ActiveSupport::SafeBuffer] the rendered uploader HTML
        #
        # @example Basic usage
        #   <%= uploadcare_uploader_field :user, :avatar %>
        #
        # @example With options
        #   <%= uploadcare_uploader_field :post, :image, multiple: false, solution: "inline" %>
        #
        # With validation errors, the field will be wrapped according to
        # ActionView::Base.field_error_proc (by default: <div class="field_with_errors">)
        def uploadcare_uploader_field(object_name, method_name, ctx_name: nil, solution: "regular", **options)
          # Retrieve the object from instance variables (like Rails form helpers do)
          object = instance_variable_get("@#{object_name}")

          ctx_name ||= SecureRandom.uuid
          field_name = "#{object_name}[#{method_name}]"
          field_html = uploadcare_uploader_field_tag(field_name, ctx_name: ctx_name, solution: solution, **options)

          # Apply error wrapping if object has validation errors on this method
          if uploadcare_object_has_errors?(object, method_name)
            uploadcare_error_wrapping(field_html)
          else
            field_html
          end
        end

        # A view helper to add a standalone File Uploader component (without form binding).
        # This is a "tag" helper - it does NOT check for validation errors.
        # Use uploadcare_uploader_field for model-bound fields with error handling.
        #
        # @param name [Symbol, String] the field name for the form input
        # @param ctx_name [String, nil] optional context name for linking uploader components
        # @param solution [String] uploader solution type: "regular", "inline", or "minimal"
        # @param options [Hash] additional options passed to uploadcare_config_tag
        # @return [ActiveSupport::SafeBuffer] the rendered uploader HTML
        #
        # @example Basic usage
        #   <%= uploadcare_uploader_field_tag :file %>
        #
        # @example With custom name
        #   <%= uploadcare_uploader_field_tag "user[avatar]" %>
        def uploadcare_uploader_field_tag(name, ctx_name: nil, solution: "regular", **options)
          ctx_name ||= SecureRandom.uuid

          form_input = uploadcare_form_input_tag(name: name, ctx_name: ctx_name)
          uploader = uploadcare_uploader(ctx_name: ctx_name, solution: solution, **options)

          safe_join([ form_input, uploader ])
        end

        # A view helper to add just the uploader component without a hidden input.
        # Useful when you want to handle the uploaded file data with custom JavaScript.
        #
        # @param ctx_name [String] required context name for linking uploader components
        # @param solution [String] uploader solution type: "regular", "inline", or "minimal"
        # @param options [Hash] additional options passed to uploadcare_config_tag
        # @return [ActiveSupport::SafeBuffer] the rendered uploader HTML
        #
        # @example
        #   <%= uploadcare_uploader ctx_name: "my-uploader" %>
        def uploadcare_uploader(ctx_name:, solution: "regular", **options)
          ctx_name ||= SecureRandom.uuid

          config = uploadcare_config_tag(ctx_name: ctx_name, **options)
          uploader = uploadcare_uploader_tag(ctx_name: ctx_name, solution: solution)
          ctx_provider = uploadcare_ctx_provider_tag(ctx_name: ctx_name)

          safe_join([ config, uploader, ctx_provider ])
        end

        # A view helper to add the uc-config element for File Uploader configuration.
        # See https://uploadcare.com/docs/file-uploader/configuration/ for more info.
        #
        # @param ctx_name [String] required context name for linking to uploader components
        # @param options [Hash] configuration options (keys are converted to kebab-case attributes)
        # @return [ActiveSupport::SafeBuffer] the rendered uc-config element
        def uploadcare_config_tag(ctx_name:, **options)
          default_options = Uploadcare::Rails.configuration.uploader_config_attributes

          # Normalize all keys to kebab-case symbols for consistent merging.
          # Handles: string keys ("img-only"), symbol keys (:img_only), and mixed formats.
          normalize_key = ->(key) { key.to_s.tr("_", "-").to_sym }

          options = default_options
            .transform_keys(&normalize_key)
            .merge(options.transform_keys(&normalize_key))
          options[:'ctx-name'] = ctx_name
          attrs = []

          options.each do |key, value|
            attr_name = key.to_s

            # Generating attributes manually, because ActionView treats `multiple` specially:
            # as a boolean attribute for inputs/selects and always renders it as multiple="multiple"
            attrs << %(#{attr_name}="#{ERB::Util.html_escape(value)}")
          end

          "<uc-config #{attrs.join(' ')}></uc-config>".html_safe
        end

        # Generates the uc-file-uploader-* element
        def uploadcare_uploader_tag(ctx_name:, solution: "regular")
          content_tag("uc-file-uploader-#{solution}", "", "ctx-name": ctx_name)
        end

        # Generates the uc-upload-ctx-provider element
        def uploadcare_ctx_provider_tag(ctx_name:)
          content_tag("uc-upload-ctx-provider", "", "ctx-name": ctx_name)
        end

        # Generates the uc-form-input element.
        #
        # The uploader automatically creates hidden input(s) with the specified name
        # and keeps their values in sync with uploaded files.
        #
        # Behavior depends on configuration:
        # - Single file: creates one hidden input with the specified name
        # - Multiple files with group-output: creates one input with group UUID
        # - Multiple files without group-output: creates separate inputs for each file,
        #   automatically appending "[]" to the name for Rails array parameter handling:
        #     <input name="user[photos][]" ...>
        #     <input name="user[photos][]" ...>
        #
        # @param name [String, nil] the form field name attribute
        # @param ctx_name [String] the context name for linking to uploader components
        def uploadcare_form_input_tag(name: nil, ctx_name:)
          options = { "ctx-name": ctx_name }
          options[:name] = name if name
          content_tag("uc-form-input", "", options)
        end

        private

        # Check if the object has validation errors on the given method
        # Following the same pattern as Rails' ActiveModelInstanceTag
        def uploadcare_object_has_errors?(object, method_name)
          return false unless object.respond_to?(:errors)
          return false unless object.errors.respond_to?(:[])

          object.errors[method_name].present?
        end

        # Wrap the HTML with the field_error_proc if configured
        # This mimics Rails' error_wrapping behavior
        def uploadcare_error_wrapping(html_tag)
          instance_exec(html_tag, self, &::ActionView::Base.field_error_proc)
        end
      end
    end
  end
end

# Include the helpers in ActionView
ActionView::Base.include Uploadcare::Rails::ActionView::UploadcareUploaderTags
