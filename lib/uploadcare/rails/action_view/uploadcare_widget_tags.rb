require 'uploadcare/rails/configuration'

module Uploadcare::Rails::ActionView
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
    #   min: (true/false, default: true) - sets which version to get, minified or not

    CDN_HOSTNAME = 'ucarecdn.com'

    def uploadcare_include_tag(version: '3.x', bundle: 'full', min: true)
      min = min == true ? '.min' : ''
      bundle = bundle == 'default' ? '' : ".#{bundle}"
      path = "/libs/widget/#{version}/uploadcare#{bundle}#{min}.js"
      uri = URI::HTTPS.build(host: CDN_HOSTNAME, path: path)

      config_tag = javascript_tag(uploader_settings) if uploader_settings.present?
      include_tag = javascript_include_tag(uri.to_s.squeeze('.'))

      include_tag.concat(config_tag)
    end

    private

    def uploader_settings
      @uploader_settings ||= Uploadcare::Rails.configuration.uploader_parameters
    end
  end
end

ActionView::Base.send :include, Uploadcare::Rails::ActionView::UploadcareWidgetTags
