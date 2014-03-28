module Uploadcare::Rails::SimpleForm
  class UploadcareUploaderInput < SimpleForm::Inputs::HiddenInput
    def input_html_options
      @input_html_options.merge role: "#{@input_html_options[:role]} uploadcare-uploader"
    end
  end
end

SimpleForm::Inputs.send :include, Uploadcare::Rails::SimpleForm