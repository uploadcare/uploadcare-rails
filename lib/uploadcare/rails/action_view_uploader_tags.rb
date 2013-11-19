# require "action_view_form_builder"

module Uploadcare::Rails::ActionView
  module UploaderTags
    def uploadcare_uploader_options options
      options.symbolize_keys.deep_merge({
        :role => "uploadcare-uploader #{options[:role]}",
        :data => {:path_value => true}
      })
    end

    def uploadcare_uploader_tag name, options = {}
      options = uploadcare_uploader_options(options)
      hidden_field_tag(name, nil, options)
    end

    def uploadcare_uploader_field object_name, method, options = {}
      options = uploadcare_uploader_options(options)
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
ActionView::Base.send :include, Uploadcare::Rails::ActionView::UploaderTags