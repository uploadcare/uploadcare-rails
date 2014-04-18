module Uploadcare::Rails::Formtastic
  class UploadcareInput < Formtastic::Inputs::HiddenInput
    include Uploadcare::Rails::ActionView::UploaderTags
    
    def role
      "#{@options[:role]}".strip
    end

    def input_html_options
      @options = uploadcare_uploader_options(@options)
      super.merge role: role, data: @options[:data]
    end

    def is_file?
      @builder.object.try("has_#{@attribute}_as_uploadcare_file?".to_sym) && !@builder.object.try("has_#{@attribute}_as_uploadcare_group?".to_sym)
    end

    def is_group?
      @builder.object.try("has_#{@attribute}_as_uploadcare_file?".to_sym) && !@builder.object.try("has_#{@attribute}_as_uploadcare_group?".to_sym)
    end
  end

  class UploadcareUploaderInput < Uploadcare::Rails::Formtastic::UploadcareInput
    def input
      @options ||= {}
      @options[:uploadcare] ||= {}
      if is_file?
        @options[:uploadcare][:multiple] = false
      elsif is_group?
        @options[:uploadcare][:multiple] = true
      end
      super
    end
  end

  class UploadcareSingleUploaderInput < Uploadcare::Rails::Formtastic::UploadcareInput 
    def input
      @options ||= {}
      @options[:uploadcare] ||= {}
      @options[:uploadcare][:multiple] = false
      super
    end   
  end

  class UploadcareMultipleUploaderInput < Uploadcare::Rails::Formtastic::UploadcareInput
    def input
      @options ||= {}
      @options[:uploadcare] ||= {}
      @options[:uploadcare][:multiple] = true
      super
    end 
  end
end

Formtastic::Inputs.send :include, Uploadcare::Rails::Formtastic