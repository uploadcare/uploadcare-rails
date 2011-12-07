require "uploadcare-rails/version"
require "uploadcare-rails/exception"
require "uploadcare-rails/install"
require "uploadcare-rails/inject"
require "uploadcare-rails/upload"

module Uploadcare
  module Rails
    def self.installed?
      Install.installed?
    end
    
    def self.install
      Install.install
    end
    
    def self.config_location
      Install.config_location
    end
    
    def self.config
      config = if installed?
        YAML.load_file(config_location)
      else
        Install.default_config
      end
    end
  end
  
  module Rails
    module ClassMethods
      def has_uploadcare_file(name, options = {})
        include InstanceMethods
        
        options[:uuid_column]      ||= "uploadcare_file_uuid"
        options[:file_info_column] ||= "uploadcare_file_info"
        options[:auto_keep]        ||= true
        
        serialize :"#{options[:file_info_column]}", Hash
        
        unless self.column_names.include?(options[:uuid_column])
          raise DatabaseError, "UUID column not found in columns list, please run 'uploadcare_rails' generator to generate migration and 'rake db:migrate' to apply changes to database.", caller
        end
        
        define_method name do
          upload_for name, options
        end
        
        define_method "#{name.to_s}_before_type_cast" do
          self.instance_variable_get("@_#{name.to_s}")
        end
        
        define_method "#{name.to_s}?" do
          upload_for(name, options).exist?
        end
        
        define_method "#{name.to_s}=" do |uuid|
          #unless uuid.blank?
            self.instance_variable_set("@_#{options[:uuid_column]}", read_attribute(options[:uuid_column]))
            self.instance_variable_set("@_#{name.to_s}", uuid)
            upload_for(name, options).assign_uuid(uuid)
          #end
        end
        
        define_method "#{name.to_s}_modified?" do
          modified   = false
          check_uuid = self.instance_variable_get("@_#{name.to_s}")
          
          if new_record?
            modified = !check_uuid.blank?
          else
            old_uuid = self.instance_variable_get("@_#{options[:uuid_column]}")
            modified = !check_uuid.blank? && (old_uuid.blank? || old_uuid != check_uuid)
          end
          modified
        end
        
        define_method "reload_file_info" do
          upload_for(name, options).reload
        end
      end
      
      def validates_upload_type(name, options = {})
      end
      
      def validates_upload_size(name, options = {})
        min     = options[:min] || options[:in] && options[:in].first || 0
        max     = options[:max] || options[:in] && options[:in].last || 0
        message = options[:message] || "file size must be between :min and :max bytes"
        message = message.gsub(/:min/, min.to_s).gsub(/:max/, max.to_s)
        
        validates_each :"#{name}" do |record, attr, value|
          if_clause_passed = options[:if].nil? || (options[:if].respond_to?(:call) ? options[:if].call(record) != false : record.send(options[:if]))
          unless_clause_passed = options[:unless].nil? || (options[:unless].respond_to?(:call) ? !!options[:unless].call(record) == false : !record.send(options[:unless]))
          upload = record.send("#{name}")
          if upload.info_loaded?
            if if_clause_passed && unless_clause_passed && (upload.size < min || (upload.size > max && !max.zero?))
              record.errors.add("#{name}", message)
            end
          else
            record.errors.add("#{name}", message)
          end
        end
      end
      
      def validates_upload_presence(name, options = {})
        message = options[:message] || "must be present"
        validates_each :"#{name}" do |record, attr, value|
          if_clause_passed = options[:if].nil? || (options[:if].respond_to?(:call) ? options[:if].call(record) != false : record.send(options[:if]))
          unless_clause_passed = options[:unless].nil? || (options[:unless].respond_to?(:call) ? !!options[:unless].call(record) == false : !record.send(options[:unless]))
          if if_clause_passed && unless_clause_passed && !value.valid_upload?
            record.errors.add("#{name}", message)
          end
        end
      end
    end
    
    module InstanceMethods
      def upload_for(name, options)
        Upload.new(name, options, self)
      end
    end
    
    module ActiveRecord
      def self.included(base)
        base.extend ClassMethods
      end
    end

    module FormBuilder
      module InstanceMethods
        def uploadcare_field(method, options = {})
          config = ::Uploadcare::Rails.config
          options[:role] ||= case config["widget_type"]
            when "plain"
              "uploadcare-plain-uploader"
            when "line"
              "uploadcare-line-uploader"
            else
              "uploadcare-plain-uploader"
            end
          options["data-public-key"] ||= config["public_key"]

          self.hidden_field method, options
        end
      end
      
      def self.included(base)
        base.send(:include, InstanceMethods)
      end
    end
  end
  
  class File
    def remove
      @ucare.make_request('DELETE', api_uri).parsed_response
    end
  end
end

unless Rails.root.blank?
  Uploadcare::Rails.install unless Uploadcare::Rails.installed?
end

Uploadcare::Rails::Inject.try_inject