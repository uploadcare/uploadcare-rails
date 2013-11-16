# defaults_file = "#{Rails.root}/config/uploadcare_defaults.yml"
config_file = "#{Rails.root}/config/uploadcare.yml"#Rails.root.join('config', "uploadcare.yml")

if File.exists?(config_file)
  # defaults = YAML.load_file(defaults_file)
  config = YAML.load_file(config_file)
  UPLOADCARE_SETTINGS = Uploadcare::Rails::Settings.new config
else
  raise "You have not created config/uploadcare.yml"
end