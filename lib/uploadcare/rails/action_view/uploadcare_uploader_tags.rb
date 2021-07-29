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
          options[:multiple] = multiple?(object_name, method_name)
          data_options = options.map { |key, value| ["data-#{key.to_s.underscore.dasherize}", value] }.to_h
          field_options = DEFAULT_FIELD_OPTIONS.merge(data_options)
          hidden_field(object_name, method_name, field_options)
        end

        private

        def multiple?(object_name, method_name)
          model = object_name.to_s.camelize.safe_constantize
          model&.send "has_uploadcare_file_group_for_#{method_name}?"
        rescue NoMethodError
          false
        end
      end
    end
  end
end

ActionView::Base.include Uploadcare::Rails::ActionView::UploadcareUploaderTags
