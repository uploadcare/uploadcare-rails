# frozen_string_literal: true

require "mongoid"
require "uploadcare/rails/internal/model_macros"

module Uploadcare
  module Rails
    module Internal
      module MongoidHooks
        extend ActiveSupport::Concern
        include ModelMacros

        private

        def read_uploadcare_attribute(attribute)
          read_attribute(attribute)
        end

        class_methods do
          private

          def register_uploadcare_file_callbacks(attribute)
            if Uploadcare::Rails.configuration.store_files_after_save
              register_uploadcare_store_callback(attribute)
            end

            if Uploadcare::Rails.configuration.delete_files_after_destroy
              register_uploadcare_delete_callback(attribute)
            end
          end

          def register_uploadcare_group_callbacks(attribute)
            if Uploadcare::Rails.configuration.store_files_after_save
              register_uploadcare_store_callback(attribute)
            end
          end

          def register_uploadcare_store_callback(attribute)
            callback = :"uploadcare_store_#{attribute}!"

            if respond_to?(:after_commit)
              after_commit callback, if: -> { !destroyed? && previous_changes.key?(attribute.to_s) }
            else
              set_callback(:save, :after, callback, if: :"#{attribute}_changed?")
            end
          end

          def register_uploadcare_delete_callback(attribute)
            callback = :"uploadcare_delete_#{attribute}!"

            if respond_to?(:after_commit)
              after_commit callback, if: :destroyed?
            else
              set_callback(:destroy, :after, callback)
            end
          end
        end
      end
    end
  end
end
