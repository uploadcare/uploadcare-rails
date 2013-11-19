module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_file attribute, options={}
        define_method "#{attribute}" do
          cdn_url = attributes[attribute.to_s].to_s
          return nil if cdn_url.empty?

          if instance_variable_defined?("@#{attribute}_cached")
            instance_variable_get("@#{attribute}_cached")
          else
            api = ::Rails.application.config.uploadcare.api
            file_data = File.new(api, cdn_url)
            instance_variable_set("@#{attribute}_cached", file_data)
            file_data
          end
        end
      end
    end
  end
end