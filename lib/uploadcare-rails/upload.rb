require 'uploadcare'

class Uploadcare::Rails::Upload
  SERVICES_URL = 'http://services.uploadcare.com'
  IMAGE_MIMES = ['jpeg', 'jpg', 'png', 'gif', 'tiff'].map!{|x| "image/#{x}"}
  attr_reader :uuid
  
  def initialize(field_method, options, instance)
    @_field_method = field_method
    @_options = options
    @_instance = instance
    @uuid = self.uuid_value
  end
  
  def removed?
    inf = self.file_info
    !inf["removed"].blank? && inf["removed"]
  end
  
  def image?
    IMAGE_MIMES.include?(@_file_info["mime_type"])
  end
  
  def url
    self.file_info["url"]
  end
  
  def resized_url(to = '640x480')
    url = [SERVICES_URL].push('resizer').push(@uuid).push(to).join('/')
    url + "/"
  end
  
  def crop_url(to = '640x480')
    url = [self.resized_url(to)].push('crop').join('/')
    url + "/"
  end
  
  def original_url
    self.file_info["original_file_url"]
  end
  
  def size
    self.file_info["size"].blank? ? 0 : self.file_info["size"]
  end
  
  def kept?
    !self.file_info["last_keep_claim"].blank?
  end

  def file_info
    get_file_info
  end
  
  def assign_uuid(new_uuid)
    if @_options[:auto_keep]
      self.keep 
    else
      self.reload unless new_uuid.blank?
    end
  end
  
  def uuid_value
    @_instance.send("#{@_field_method.to_s}_before_type_cast")
  end

  def keep
    f = self.get_file_instance
    f.keep
    self.reload
  end
  
  def reload
    save_instance
  end
  
  def remove
    self.get_file_instance.remove
    save_instance
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
    
    def save_instance
      if Rails.version > "3"
        @_instance.save(:validate => false)
      else
        @_instance.save(false)
      end
    end
end