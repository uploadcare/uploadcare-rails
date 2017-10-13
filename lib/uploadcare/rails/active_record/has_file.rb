require "uploadcare/rails/objects/file"

module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_file(attribute, options={})

        define_method "has_#{attribute}_as_uploadcare_file?" do
          true
        end

        define_method "has_#{attribute}_as_uploadcare_group?" do
          false
        end

        define_method 'build_file' do
          cdn_url = attributes[attribute.to_s].to_s
          return nil if cdn_url.empty?

          api = ::Rails.application.config.uploadcare.api
          cache = ::Rails.cache

          if file_obj ||= cache.read(cdn_url)
            Uploadcare::Rails::File.new(api, cdn_url, file_obj)
          else
            Uploadcare::Rails::File.new(api, cdn_url)
          end
        end

        # attribute method - return file object
        # it is not the ::File but ::Rails::File
        # it has some helpers for rails enviroment
        # but it also has all the methods of Uploadcare::File so no worries.
        define_method "#{ attribute }" do
          build_file
        end

        define_method "check_#{ attribute }_for_uuid" do
          url = attributes[attribute.to_s]
          if url.present?
            result = Uploadcare::Parser.parse(url)
            raise 'Invalid Uploadcare file uuid' unless result.is_a?(Uploadcare::Parser::File)
          end
        end

        define_method "store_#{ attribute }" do
          file = build_file

          return unless file

          begin
            file.store
            ::Rails.cache.write(file.cdn_url, file.marshal_dump) if UPLOADCARE_SETTINGS.cache_files
          rescue Exception => e
            logger.error "\nError while saving a file #{file.cdn_url}: #{e.class} (#{e.message}):"
            logger.error "#{::Rails.backtrace_cleaner.clean(e.backtrace).join("\n ")}"
          end

          file
        end

        define_method "delete_#{ attribute }" do
          file = build_file

          begin
            file.delete
            ::Rails.cache.write(file.cdn_url, file.marshal_dump) if UPLOADCARE_SETTINGS.cache_files
          rescue Exception => e
            logger.error "\nError while deleting a file #{cdn_url}: #{e.class} (#{e.message}):"
            logger.error "#{::Rails.backtrace_cleaner.clean(e.backtrace).join("\n ")}"
          end

          file
        end

        # before saving we checking what it is a actually file cdn url
        # or uuid. uuid will do.
        # group url or uuid should raise an erorr
        before_save "check_#{attribute}_for_uuid".to_sym

        after_save "store_#{attribute}".to_sym if UPLOADCARE_SETTINGS.store_after_save

        after_destroy "delete_#{attribute}".to_sym if UPLOADCARE_SETTINGS.delete_after_destroy
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord
