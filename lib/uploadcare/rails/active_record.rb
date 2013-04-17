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
            re = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
            m = re.match(attributes[attribute.to_s])
            return nil if m.nil?

            file_data = ::Rails.application.config.uploadcare.api.file(m[0])
            instance_variable_set("@#{attribute}_cached", file_data)
            file_data
          end
        end

        if opts[:autostore]
          after_save "store_#{attribute}"

          define_method "store_#{attribute}" do
            if send(attribute).present?
              send(attribute).store
            end
          end
        end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord
