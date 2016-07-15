module Uploadcare::Rails::SimpleForm
  class UploadcareInput < SimpleForm::Inputs::HiddenInput
    include Uploadcare::Rails::ActionView::UploaderTags

    def input(wrapper_options = nil)
      @options = uploadcare_uploader_options(@options)
      super
    end

    def role
      "#{ @input_html_options[:role] } uploadcare-uploader".strip
    end

    def input_html_options
      @input_html_options.merge role: role, data: @options[:data]
    end

    def file?
      @builder.object.try("has_#{ @attribute }_as_uploadcare_file?".to_sym) &&
        !@builder.object.try("has_#{ @attribute }_as_uploadcare_group?".to_sym)
    end

    def group?
      @builder.object.try("has_#{ @attribute }_as_uploadcare_file?".to_sym) &&
        !@builder.object.try("has_#{ @attribute }_as_uploadcare_group?".to_sym)
    end
  end

  class UploadcareUploaderInput < Uploadcare::Rails::SimpleForm::UploadcareInput
    def input(wrapper_options = nil)
      @options ||= {}
      @options[:uploadcare] ||= {}

      @options[:uploadcare][:multiple] =
        if file?
          false
        elsif group?
          true
        end
      super
    end
  end

  class UploadcareSingleUploaderInput < Uploadcare::Rails::SimpleForm::UploadcareInput
    def input(wrapper_options = nil)
      @options ||= {}
      @options[:uploadcare] ||= {}
      @options[:uploadcare][:multiple] = false
      super
    end
  end

  class UploadcareMultipleUploaderInput < Uploadcare::Rails::SimpleForm::UploadcareInput
    def input(wrapper_options = nil)
      @options ||= {}
      @options[:uploadcare] ||= {}
      @options[:uploadcare][:multiple] = true
      super
    end
  end
end

SimpleForm::Inputs.send :include, Uploadcare::Rails::SimpleForm
