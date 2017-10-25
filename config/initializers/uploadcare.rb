config_file = Rails.root.join('config', 'uploadcare.yml')

config =
  if File.exist?(config_file)
    YAML.load(ERB.new(File.new(config_file).read).result)
  else
    # output warning in red color
    # use default settings just to boot up
    puts <<-eos
      \e[31mWarning: no uploadcare.yml config file found.\e[0m
      \e[31mwhile we will use default settings please run\e[0m
        \e[36mrails g uploadcare_config\e[0m
      \e[31mto set up config file.\e[0m
    eos

    {
      defaults:    { public_key: 'demopublickey', private_key: 'demoprivatekey' },
      development: { public_key: 'demopublickey', private_key: 'demoprivatekey' },
      test:        { public_key: 'demopublickey', private_key: 'demoprivatekey' },
      production:  { public_key: 'demopublickey', private_key: 'demoprivatekey' }
    }
  end

UPLOADCARE_SETTINGS = Uploadcare::Rails::Settings.new(config)
# shortcut for later usage
Rails.application.config.uploadcare = UPLOADCARE_SETTINGS
