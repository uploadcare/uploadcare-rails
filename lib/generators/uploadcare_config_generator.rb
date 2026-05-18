# frozen_string_literal: true

class UploadcareConfigGenerator < Rails::Generators::Base
  desc "This generator creates a config/uploadcare.yml file for uploadcare-rails"

  source_root File.expand_path("templates", __dir__)

  def create_config_file
    copy_file "uploadcare_config.yml.erb", "config/uploadcare.yml"
  end
end
