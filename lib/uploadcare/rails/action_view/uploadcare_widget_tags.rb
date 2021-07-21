require 'uploadcare/rails/exceptions/uploadcare_widget_bundle_error'
require 'uploadcare/rails/configuration'

module Uploadcare::Rails::ActionView
  module UploadcareWidgetTags
    # A view helper to add a js script tag from CDN with just one string of code.
    # See https://uploadcare.com/docs/uploads/file-uploader/#cdn for more info.
    #
    # Example:
    #   <%= uploadcare_widget_tag %>
    #   => <script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js"></script>
    #      <script>
    #        UPLOADCARE_PUBLIC_KEY = 'demopublickey';
    #        UPLOADCARE_LOCALE = 'en';
    #      </script>
    #
    # Arguments:
    #   version: (String, default: '3.x') - version of the widget
    #   bundle: (String, default: 'full') - https://uploadcare.com/docs/uploads/file-uploader/#bundles
    #   min: (true/false, default: true) - sets which version to get, minified or not

    UC_ORIGIN = 'ucarecdn.com'

    def uploadcare_widget_tag(version: '3.x', bundle: 'full', min: true)
      min = min == true ? '.min' : ''
      bundle = bundle == 'default' ? '' : ".#{bundle}"
      path = ["/libs/widget/#{version}/", "uploadcare#{bundle}#{min}.js"].join
      uri = URI::HTTPS.build(host: UC_ORIGIN, path: path)

      config_tag = javascript_tag(widget_settings) if widget_settings.present?
      include_tag = javascript_include_tag(uri.to_s.squeeze('.'))

      include_tag.concat(config_tag)
    end

    private

    def widget_settings
      @widget_settings ||= Uploadcare::Rails.configuration.widget_parameters
    end
  end
end

ActionView::Base.send :include, Uploadcare::Rails::ActionView::UploadcareWidgetTags
