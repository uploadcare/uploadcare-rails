# frozen_string_literal: true

require 'action_view'
require 'uploadcare/rails/configuration'

module Uploadcare
  module Rails
    module ActionView
      # A module containing a view field helper
      module UploadcareUploaderTags
        # A view helper to add a uploader button to a html-page
        # See https://uploadcare.com/docs/uploads/file-uploader/#using-on-page for more info.
        #
        # Example:
        #   <%= uploadcare_uploader_field :post, :title %>
        #   => <input role="uploadcare-uploader" data-multiple="true" type="hidden" name="post[file]" id="post_file">
        #      <div class="uploadcare--widget uploadcare--widget_status_ready" ...
        #
        # Arguments:
        #   object_name: (String/Symbol) - object name which a field belongs to
        #   method_name: (String/Symbol) - object method name
        #   options: (Hash, default: {}) - options for hidden_field

        DEFAULT_FIELD_OPTIONS = { role: 'uploadcare-uploader' }.freeze

        def uploadcare_uploader_field(object_name, method_name, options = {})
          hidden_field(
            object_name,
            method_name,
            uploadcare_uploader_options(
              options.reverse_merge(multiple: uploadcare_uploader_multiple?(object_name, method_name).presence)
            )
          )
        end

        def uploadcare_uploader_field_tag(object_name, options = {})
          hidden_field_tag(object_name, options[:value], uploadcare_uploader_options(options))
        end

        def uploadcare_uploader_options(options = {})
          data_options = options.transform_keys { |key| "data-#{key.to_s.underscore.dasherize}" }
          DEFAULT_FIELD_OPTIONS.merge(data_options)
        end

        private

        def uploadcare_uploader_multiple?(object_name, method_name)
          model = object_name.to_s.camelize.safe_constantize
          method_name = "has_uploadcare_file_group_for_#{method_name}?"
          model.respond_to?(method_name) && model.public_send(method_name)
        end
      end
    end
  end
end

ActionView::Base.include Uploadcare::Rails::ActionView::UploadcareUploaderTags
