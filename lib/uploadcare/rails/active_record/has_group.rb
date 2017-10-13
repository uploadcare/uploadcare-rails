require 'uploadcare/rails/objects/group'

module Uploadcare
  module Rails
    module ActiveRecord
      def has_uploadcare_group(attribute, options = {})
        define_method "has_#{ attribute }_as_uploadcare_file?" do
          false
        end

        define_method "has_#{ attribute }_as_uploadcare_group?" do
          true
        end

        define_method 'build_group' do
          cdn_url = attributes[attribute.to_s].to_s
          return nil if cdn_url.empty?

          api = ::Rails.application.config.uploadcare.api
          cache = ::Rails.cache

          if group_obj = cache.read(cdn_url)
            Uploadcare::Rails::Group.new(api, cdn_url, group_obj)
          else
            Uploadcare::Rails::Group.new(api, cdn_url)
          end
        end

        # attribute method - return file object
        define_method "#{ attribute }" do
          build_group
        end

        define_method "check_#{ attribute }_for_uuid" do
          url = attributes[attribute.to_s]

          unless url.blank?
            result = Uploadcare::Parser.parse(url)

            unless result.is_a?(Uploadcare::Parser::Group)
              raise 'Invalid group uuid'
            end
          end
        end

        define_method "store_#{ attribute }" do
          group = build_group
          return unless group.present?

          begin
            group.store
            ::Rails.cache.write(group.cdn_url, group.marshal_dump) if UPLOADCARE_SETTINGS.cache_groups
          rescue Exception => e
            logger.error "\nError while storing a group #{ group.cdn_url }: #{ e.class } (#{e.message }):"
            logger.error "#{::Rails.backtrace_cleaner.clean(e.backtrace).join("\n ")}"
          end
        end

        define_method "delete_#{ attribute }" do
          group = build_group

          begin
            group.delete
            ::Rails.cache.write(group.cdn_url, group.marshal_dump) if UPLOADCARE_SETTINGS.cache_groups
          rescue Exception => e
            logger.error "\nError while deleting a group #{group.cdn_url}: #{e.class} (#{e.message}):"
            logger.error "#{::Rails.backtrace_cleaner.clean(e.backtrace).join("\n ")}"
          end
        end

        # before saving we checking what it is a actually file cdn url
        # or uuid. uuid will do.
        # group url or uuid should raise an erorr
        before_save "check_#{ attribute }_for_uuid".to_sym

        after_save "store_#{ attribute }".to_sym if UPLOADCARE_SETTINGS.store_after_save

        after_destroy "delete_#{ attribute }".to_sym if UPLOADCARE_SETTINGS.delete_after_destroy
      end
    end
  end
end

ActiveRecord::Base.extend Uploadcare::Rails::ActiveRecord
