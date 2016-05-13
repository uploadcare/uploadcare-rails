module Uploadcare::Rails::ActionView
  module IncludeTags
    def include_uploadcare_widget_from_cdn options={}
      settings = {
        min: true,
        version: UPLOADCARE_SETTINGS.widget_version
      }

      settings.merge!(options)

      v = settings[:version]
      m = settings[:min] ? ".min" : ""
      url = "https://ucarecdn.com/widget/#{v}/uploadcare/uploadcare-#{v}#{m}.js"

      javascript_include_tag(url)
    end
    alias_method :inlude_uploadcare_widget, :include_uploadcare_widget_from_cdn
    alias_method :uplodacare_widget, :include_uploadcare_widget_from_cdn


    def uploadcare_settings options={}
      settings = UPLOADCARE_SETTINGS.widget_settings
      settings.merge!(options)
      js_settings = String.new
      settings.each do |k, v|
        if v.is_a?(TrueClass) || v.is_a?(FalseClass)
          js_settings << "UPLOADCARE_#{k.to_s.underscore.upcase} = #{v};\n"
        else
          js_settings << "UPLOADCARE_#{k.to_s.underscore.upcase} = \"#{v}\";\n"
        end
      end

      uc_settings = javascript_tag(js_settings)
    end
  end
end

ActionView::Base.send :include, Uploadcare::Rails::ActionView::IncludeTags
