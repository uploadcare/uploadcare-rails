require 'json' unless defined? JSON
require 'httparty' unless defined? HTTParty

Uploadcare::File.class_eval do
  include HTTParty
  base_uri 'http://upload.uploadcare.com'
  
  alias :old_info :info
  alias :old_update_info :update_info
  attr_accessor :file_size
  
  def info
    self.old_info
    self.append_file_size
    @file_info
  end
  
  def update_info
    self.old_update_info
    self.append_file_size
  end
  
  protected
    def append_file_size
      self.get_file_size if self.file_size.nil?
      
      unless @file_info.is_a?(Hash)
        @file_info = JSON.parse(@file_info)
      end
      
      @file_info.merge!({"size" => self.file_size})
    end
  
    def get_file_size
      public_key = @ucare.instance_variable_get("@public_key")
      options    = Hash[:query => {:pub_key => public_key, :file_id => @file_id}]

      result = self.class.get("/info/", options).parsed_response
      result = JSON.parse(result)
      self.file_size = result["size"]
    end
end
