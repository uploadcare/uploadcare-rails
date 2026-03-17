# frozen_string_literal: true

require "active_record"
require "uploadcare/rails/internal/model_macros"

module Uploadcare
  module Rails
    module Internal
      module ActiveRecordHooks
        extend ActiveSupport::Concern
        include ModelMacros

        private

        def read_uploadcare_attribute(attribute)
          attributes[attribute.to_s]
        end

        class_methods do
          private

          def register_uploadcare_file_callbacks(attribute)
            if Uploadcare::Rails.configuration.store_files_after_save
              after_save :"uploadcare_store_#{attribute}!", if: :"will_save_change_to_#{attribute}?"
            end

            if Uploadcare::Rails.configuration.delete_files_after_destroy
              after_destroy :"uploadcare_delete_#{attribute}!"
            end
          end

          def register_uploadcare_group_callbacks(attribute)
            if Uploadcare::Rails.configuration.store_files_after_save
              after_save :"uploadcare_store_#{attribute}!"
            end
          end
        end
      end
    end
  end
end
