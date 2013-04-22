module Uploadcare
  module Rails
    module ActiveRecord
      def is_uploadcare_file attribute, options = {}
        options.symbolize_keys!
        opts = {
          autostore: true,
          force_autostore: false
        }.update options

        define_method "#{attribute}" do
          cdn_url = attributes[attribute.to_s]
          return nil unless cdn_url

          if instance_variable_defined?("@#{attribute}_cached")
            instance_variable_get("@#{attribute}_cached")
          else
            file_data = ::Rails.application.config.uploadcare.api.file(cdn_url)
            instance_variable_set("@#{attribute}_cached", file_data)
            file_data
          end
        end

        if opts[:autostore]
          after_save "store_#{attribute}"

          define_method "store_#{attribute}" do
            uuid = get_uuid.call(attributes)
            stored = ::Rails.cache.exist?(
              "uploadcare.file.#{uuid}.store",
              force: opts[:force_autostore]
            )
             unless stored
              send(attribute).store
              ::Rails.cache.write("uploadcare.file.#{uuid}.store", true)
            end
          end
        end
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord
