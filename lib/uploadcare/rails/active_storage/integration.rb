# frozen_string_literal: true

require 'uploadcare/rails/active_storage/uploadcare_previewer'
require 'uploadcare/rails/active_storage/variant_remote_processing'

module Uploadcare
  module Rails
    module ActiveStorage
      # :nodoc:
      module Integration
        module_function

        def install!(previewers:)
          install_previewer(previewers)
          install_variant_remote_processing
        end

        def install_previewer(previewers)
          return if previewers.nil?
          return if previewers.include?(Uploadcare::Rails::ActiveStorage::UploadcarePreviewer)

          previewers.unshift(Uploadcare::Rails::ActiveStorage::UploadcarePreviewer)
        end

        def install_variant_remote_processing
          prepend_variant_processing(::ActiveStorage::Variant) if defined?(::ActiveStorage::Variant)
          prepend_variant_processing(::ActiveStorage::VariantWithRecord) if defined?(::ActiveStorage::VariantWithRecord)
        end

        def prepend_variant_processing(variant_class)
          return if variant_class < Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing

          variant_class.prepend(Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing)
        end
      end
    end
  end
end
