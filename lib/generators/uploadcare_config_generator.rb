# frozen_string_literal: true

# A generator that copies the config template to config directory
class UploadcareConfigGenerator < Rails::Generators::Base
  desc 'This generator creates an uploadcare config file your_app/config/initializers/uploadcare.rb'

  source_root File.expand_path('templates', __dir__)

  def create_config_file
    copy_file 'uploadcare_config_template.erb', 'config/initializers/uploadcare.rb'
  end
end
