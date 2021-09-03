# frozen_string_literal: true

require 'action_view'
require 'uploadcare/rails/configuration'

module Uploadcare
  module Rails
    module ActionView
      # A module containing a view include tags helper
      module UploadcareWidgetTags
        # A view helper to add a js script tag from CDN with just one string of code.
        # See https://uploadcare.com/docs/uploads/file-uploader/#cdn for more info.
        #
        # Example:
        #   <%= uploadcare_include_tag %>
        #   => <script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js"></script>
        #      <script>
        #        UPLOADCARE_PUBLIC_KEY = 'demopublickey';
        #        UPLOADCARE_LOCALE = 'en';
        #      </script>
        #
        # Arguments:
        #   version: (String, default: '3.x') - version of the widget
        #   bundle: (String, default: 'full') - https://uploadcare.com/docs/uploads/file-uploader/#bundles
        #     valid options: 'full', 'default', 'ie8', 'api', 'lang.en'
        #   min: (true/false, default: true) - sets which version to get, minified or not

        def uploadcare_include_tag(version: '3.x', bundle: 'full', min: true)
          min = min == true ? '.min' : ''
          bundle = bundle == 'default' ? '' : ".#{bundle}"
          path = "/libs/widget/#{version}/uploadcare#{bundle}#{min}.js"
          uri = URI::HTTPS.build(host: Uploadcare::Rails.configuration.cdn_hostname, path: path)

          config_tag = javascript_tag(uploader_settings) if uploader_settings.present?
          include_tag = javascript_include_tag(uri.to_s.squeeze('.'))

          config_tag.concat(include_tag)
        end

        def uploader_settings
          @uploader_settings ||= Uploadcare::Rails.configuration.uploader_parameters
        end
      end
    end
  end
end

ActionView::Base.include Uploadcare::Rails::ActionView::UploadcareWidgetTags
