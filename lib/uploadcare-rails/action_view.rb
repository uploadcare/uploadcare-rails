module Uploadcare::Rails::ActionView
  module FormHelper
    def uploadcare_uploader_tag(name)
      hidden_field_tag name, nil, role: 'uploadcare-uploader'
    end

    def uploadcare_uploader_field(object_name, method, options = {})
      options.symbolize_keys!
      role = "#{options[:role]} uploadcare-uploader"
      options.update(role: "#{options[:role]} uploadcare-uploader")

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

ActionView::Base.send :include, Uploadcare::Rails::ActionView::FormHelper
