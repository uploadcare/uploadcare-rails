class UploadcareRailsGenerator < Rails::Generator::NamedBase
  attr_accessor :migration_name, :fields

  def initialize(args, options = {})
    super
    @class_name = args[0]
    @fields = {"uploadcare_file_uuid" => "string", "uploadcare_file_info" => "text"}
  end

  def manifest
    file_name = generate_file_name
    @migration_name = file_name.camelize
    record do |m|
      m.migration_template "uploadcare_rails_migration.rb.erb",
                           File.join('db', 'migrate'),
                           :migration_file_name => file_name
    end
  end

  private

  def generate_file_name
    "add_uploadcare_fields_to_#{@class_name.underscore}"
  end

end
