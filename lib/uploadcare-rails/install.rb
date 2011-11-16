module Uploadcare::Rails::Install
  def self.installed?
    File.exist?(self.config_location)
  end
  
  def self.install
    loc    = self.config_location
    config = self.default_config
    
    f = File.open(loc, "w")
    begin
      f.puts config.to_yaml
    rescue
      raise Uploadcare::Rails::InstallationError, "Failed to write configuration file in '#{loc}'", caller
    ensure
      f.close unless f.nil?
    end
  end
  
  def self.backup_config(filename = "")
    if filename.empty?
      filename = self.get_location "uploadcare.yml.old"
      filename += ".old" if File.exist?(filename)
    end
    begin
      FileUtils.copy_file self.config_location, filename
    rescue
      raise Uploadcare::Rails::InstallationError, "Failed to backup configuration file to '#{filename}'", caller
    end
  end
  
  def self.rewrite_config(backup = true)
    if self.installed? && backup
      self.backup_config
    end
    self.install
  end
  
  def self.default_config
    Hash[
      "public_key" => "",
      "private_key" => "",
      "widget_type" => "plain"
    ]
  end
  
  def self.config_location
    self.get_location "uploadcare.yml"
  end
  
  def self.get_location(filename)
    if defined? Rails
      Rails.root.join("config", filename)
    else
      # Try relative path
      "config/#{filename}"
    end
  end
end