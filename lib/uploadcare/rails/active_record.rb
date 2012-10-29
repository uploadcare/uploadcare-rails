module Uploadcare
  module Rails
    module ActiveRecord
      def is_uploadcare_file attribute, options = {}
        options.symbolize_keys!
        opts = {
          autostore: true
        }.update options

        define_method "#{attribute}" do
          return nil unless attributes[attribute.to_s].present?

          if instance_variable_defined?("@#{attribute}_cached")
            instance_variable_get("@#{attribute}_cached")
          else
            file_data = ::Rails.application.config.uploadcare.api.file(attributes[attribute.to_s])
            instance_variable_set("@#{attribute}_cached", file_data)
            file_data
          end
        end

        after_create "store_#{attribute}" if opts[:autostore]

        define_method "store_#{attribute}" do
          if send(attribute).present?
            send(attribute).store
          end
        end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord