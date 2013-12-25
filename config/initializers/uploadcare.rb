# require "../../lib/generators/uploadcare_config_generator"
config_file = "#{Rails.root}/config/uploadcare.yml"

if File.exists?(config_file)
  # defaults = YAML.load_file(defaults_file)
  config = YAML.load_file(config_file)
  UPLOADCARE_SETTINGS = Uploadcare::Rails::Settings.new config
  # shortcut for later usage
  Rails.application.config.uploadcare = UPLOADCARE_SETTINGS
else
  # output warning in red color
  # use default settings just to boot up
  puts <<-eos
    \e[31mWarning: no uploadcare.yml config file found.\e[0m
    \e[31mwhile we will use default settings please run\e[0m
      \e[36mrails g uploadcare_config\e[0m
    \e[31mto set up config file.\e[0m
  eos

  config = {
    "defaults" => {"public_key"=>"demopublickey", "private_key"=>"demoprivatekey"},
    "development" => {"public_key"=>"demopublickey", "private_key"=>"demoprivatekey"},
    "test" => {"public_key"=>"demopublickey", "private_key"=>"demoprivatekey"},
    "production" => {"public_key"=>"demopublickey", "private_key"=>"demoprivatekey"}
  }
  UPLOADCARE_SETTINGS = Uploadcare::Rails::Settings.new config
end