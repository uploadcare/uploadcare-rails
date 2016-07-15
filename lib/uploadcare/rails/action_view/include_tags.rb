module Uploadcare::Rails::ActionView
  module IncludeTags
    def include_uploadcare_widget_from_cdn(options = {})
      settings =
        {
          min: true,
          version: UPLOADCARE_SETTINGS.widget_version
        }.merge!(options)

      minified = settings[:min] ? 'min' : nil

      path =
        [
          'widget',
          settings[:version],
          'uploadcare',
          ['uploadcare', minified, 'js'].compact.join('.')
        ].join('/')

      url = URI::HTTPS.
        build(host: 'ucarecdn.com', path: '/' + path, scheme: :https)

      javascript_include_tag(url.to_s)
    end

    alias_method :inlude_uploadcare_widget, :include_uploadcare_widget_from_cdn
    alias_method :uplodacare_widget, :include_uploadcare_widget_from_cdn

    def uploadcare_settings(options = {})
      settings = UPLOADCARE_SETTINGS.widget_settings.merge!(options)

      js_settings = ''
      settings.each do |k, v|
        js_settings <<
          if v.is_a?(TrueClass) || v.is_a?(FalseClass)
            "UPLOADCARE_#{ k.to_s.underscore.upcase } = #{ v };\n"
          else
            "UPLOADCARE_#{ k.to_s.underscore.upcase } = \"#{ v }\";\n"
          end
      end

      javascript_tag(js_settings)
    end
  end
end

ActionView::Base.send :include, Uploadcare::Rails::ActionView::IncludeTags
