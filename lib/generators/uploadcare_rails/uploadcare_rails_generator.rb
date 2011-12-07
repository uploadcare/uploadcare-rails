require 'rails/generators/active_record'

class UploadcareRailsGenerator < ActiveRecord::Generators::Base
  desc "Create a migration to add UploadCare fields to your model. "

  def self.source_root
    @source_root ||= File.expand_path('../templates', __FILE__)
  end

  def generate_migration
    migration_template "uploadcare_rails_migration.rb.erb", "db/migrate/#{migration_file_name}"
  end

  protected

  def migration_name
    "add_uploadcare_fields_to_#{name.underscore}"
  end

  def migration_file_name
    "#{migration_name}.rb"
  end

  def migration_class_name
    migration_name.camelize
  end

  def field_names
    {"uploadcare_file_uuid" => "string", "uploadcare_file_info" => "text"}
  end
end
