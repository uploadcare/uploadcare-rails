module Uploadcare::Rails::ActionView
  module Helpers
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

    # PENDING due some issues with assets pipeline
    def include_uploadcare_widget_from_assets options={}
    end

    
    def uploadcare_settings options={}
      settings = UPLOADCARE_SETTINGS.widget_settings
      settings.merge!(options)
      js_settings = String.new
      settings.each do |k, v|
        js_settings << "UPLOADCARE_#{k.to_s.underscore.upcase} = \"#{v}\";\n"
      end

      uc_settings = javascript_tag(js_settings)
    end
  end
end

ActionView::Base.send :include, Uploadcare::Rails::ActionView::Helpers