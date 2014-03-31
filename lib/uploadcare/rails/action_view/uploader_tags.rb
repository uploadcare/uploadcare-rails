# require "action_view_form_builder"

module Uploadcare::Rails::ActionView
  module UploaderTags
    def uploadcare_uploader_options options
      options = options.symbolize_keys.deep_merge({
        :role => "uploadcare-uploader #{options[:role]}".strip,
        :data => {:path_value => true}
      })
      
      # merge uploadcare options into data-attributes
      # IMPORTANT: custome data-attrs will be overriden by
      # the uploadcare options in case of collision.
      if options[:uploadcare]
        # options[:uploadcare] ||= {}
        options[:data] = options[:data].merge!(options[:uploadcare])
        options.tap {|options| options.delete(:uploadcare)}
      else
        options
      end
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
    # call uploadcare_uploader field for form object
    # none of options will be overriden and given as-is
    def uploadcare_uploader method, options={}
      @template.uploadcare_uploader_field(@object_name, method, objectify_options(options))
    end

    # forse-set the data-multiple="false" for uploader
    def uploadcare_single_uploader_field method, options={}
      options[:uploadcare] ||= {}
      options[:uploadcare][:multiple] = false
      uploadcare_uploader(method, options)
    end

    # forse-set the data-multiple="true" for uploader
    def uploadcare_multiple_uploader_field method, options={}
      options[:uploadcare] ||= {}
      options[:uploadcare][:multiple] = true
      uploadcare_uploader(method, options)
    end

    # smart method to detect wich of - file or group - pesent
    # and then choose either multiple or single-file upload.
    # not that this method WILL override custom settings in order
    # to prevent method collisions
    def uploadcare_field method, options={}
      if @object.try("has_#{method}_as_uploadcare_file?".to_sym) && !@object.try("has_#{method}_as_uploadcare_group?".to_sym)
        uploadcare_single_uploader_field(method, options)
      elsif !@object.try("has_#{method}_as_uploadcare_file?".to_sym) && @object.try("has_#{method}_as_uploadcare_group?".to_sym)
        uploadcare_multiple_uploader_field(method, options)
      else
        uploadcare_uploader(method, options)
      end
    end
  end
end
ActionView::Base.send :include, Uploadcare::Rails::ActionView::UploaderTags