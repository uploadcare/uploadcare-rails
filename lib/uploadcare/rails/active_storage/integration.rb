# frozen_string_literal: true

require 'uploadcare/rails/active_storage/uploadcare_previewer'
require 'uploadcare/rails/active_storage/variant_remote_processing'

module Uploadcare
  module Rails
    module ActiveStorage
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
          return unless defined?(::ActiveStorage::Variant)
          return if ::ActiveStorage::Variant < Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing

          ::ActiveStorage::Variant.prepend(Uploadcare::Rails::ActiveStorage::VariantRemoteProcessing)
        end
      end
    end
  end
end
