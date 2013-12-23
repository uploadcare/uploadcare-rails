class UploadcareConfigGenerator < Rails::Generators::Base
  desc "This generator creates an uploadcare config file your_app/config/uploadcare.yml"

  source_root File.expand_path("../templates", __FILE__)

  def create_config_file
    copy_file "uploadcare_config_template.yml", "config/uploadcare.yml"#create_file "config/uploadcare.yml", config_template
  end
end