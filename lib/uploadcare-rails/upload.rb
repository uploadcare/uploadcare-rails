class Uploadcare::Rails::Upload
  attr_reader :uuid
  
  def initialize(field_method, options, instance)
    @_field_method = field_method
    @_options = options
    @_instance = instance
    @_file_info = Hash.new
    @uuid = self.uuid_value
    self.load_file_info(false)
  end
  
  def exist?
    !@uuid.blank?
  end
  
  def valid_upload?
    !@uuid.blank? && self.info_loaded?
  end
  
  def info_loaded?
    !@_file_info.blank?
  end
  
  def size
    @_file_info["size"].blank? ? 0 : @_file_info["size"]
  end
  
  def assign_uuid(new_uuid)
    @_instance.send("#{self.uuid_column_name}=", new_uuid) if @_instance.respond_to?(self.uuid_column_name)
    self.reload unless new_uuid.blank?
  end
  
  def uuid_value
    @_instance.new_record? ? @_instance.send("#{@_field_method.to_s}_before_type_cast") : @_instance.send(self.uuid_column_name)
  end

  def uuid_column_name
    @_options[:uuid_column]
  end
  
  def load_file_info(remote_fetch = true)
    @_file_info = @_instance.send("#{@_options[:file_info_column]}")
    
    if remote_fetch && @_file_info.blank?
      @_file_info = self.get_file_info
      @_instance.send("#{@_options[:file_info_column]}=", @_file_info)
    end
  end
  
  def reload
    @_file_info = self.get_file_info
    @_instance.send("#{@_options[:file_info_column]}=", @_file_info)
  end
  
  protected
    def get_file_info
      f = self.get_file_instance
      f.info
    end
  
    def get_file_instance
      self.load_config
      self.load_api_client
      
      @_api_client.file(@uuid)
    end
  
    def load_config
      @_config = ::Uploadcare::Rails.config if @_config.nil?
    end
    
    def load_api_client
      self.load_config if @_config.nil?
      @_api_client = ::Uploadcare.new(@_config["public_key"], @_config["private_key"])
    end
end