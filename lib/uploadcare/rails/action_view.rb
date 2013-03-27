module Uploadcare::Rails::ActionView
  module Helpers
    def uploadcare_include_tag(options = {})
      s = Rails.application.config.uploadcare

      src = ''
      s.get_widget_settings.each do |k, v|
        src << "UPLOADCARE_#{k.to_s.underscore.upcase} = \"#{j(v)}\";\n"
      end
      settings_code = javascript_tag(src)

      version = options[:version] || s.widget_version
      min = options[:min].nil? || options[:min]
      url = "https://ucarecdn.com/widget/#{version}/uploadcare/uploadcare-#{version}#{'.min' if min}.js"
      include_code = javascript_include_tag(url)

      settings_code + include_code
    end

    def uploadcare_uploader_tag(name)
      hidden_field_tag name, nil, {
        :role => "uploadcare-uploader",
        :data => {:path_value => true}
      }
    end

    def uploadcare_uploader_field(object_name, method, options = {})
      options.symbolize_keys!
      options.update({
        :role => "#{options[:role]} uploadcare-uploader",
        :data => {:path_value => true}
      })
      hidden_field(object_name, method, options)
    end

    def self.included(arg)
      ActionView::Helpers::FormBuilder.send(:include, Uploadcare::Rails::ActionView::FormBuilder)
    end
  end

  module FormBuilder
    def uploadcare_uploader_field(method, options = {})
      @template.uploadcare_uploader_field(@object_name, method, objectify_options(options))
    end
  end
end

ActionView::Base.send :include, Uploadcare::Rails::ActionView::Helpers
