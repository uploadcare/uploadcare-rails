module Uploadcare::Rails::ActionView
  module Helpers
    def uploadcare_include_tag(options = {})
      version = options[:version] || Rails.application.config.uploadcare.widget_version
      min = options[:min].nil? || options[:min]
      url = "https://ucarecdn.com/widget/#{version}/uploadcare/uploadcare-#{version}#{'.min' if min}.js"
      javascript_include_tag(url)
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
