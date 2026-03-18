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
              set_callback(:save, :after, :"uploadcare_store_#{attribute}!", if: :"#{attribute}_changed?")
            end

            if Uploadcare::Rails.configuration.delete_files_after_destroy
              set_callback(:destroy, :after, :"uploadcare_delete_#{attribute}!")
            end
          end

          def register_uploadcare_group_callbacks(attribute)
            if Uploadcare::Rails.configuration.store_files_after_save
              set_callback :save, :after, :"uploadcare_store_#{attribute}!", if: :"#{attribute}_changed?"
            end
          end
        end
      end
    end
  end
end
