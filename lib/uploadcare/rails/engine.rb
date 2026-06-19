# frozen_string_literal: true

require "active_support"
require "active_support/core_ext/module/delegation"
require "action_dispatch"
require "rails/engine"
require "active_support/ordered_options"

module Uploadcare
  module Rails
    class Engine < ::Rails::Engine
      config.uploadcare = ActiveSupport::OrderedOptions.new

      initializer "uploadcare-rails.configuration", before: :load_config_initializers do |app|
        load_uploadcare_settings!(app)
        Uploadcare::Rails.configuration = Uploadcare::Rails::Configuration.new(app.config.uploadcare)
      end

      initializer "uploadcare-rails.load" do
        ActiveSupport.on_load :action_view do
          require "uploadcare/rails/action_view/uploadcare_include_tags"
          require "uploadcare/rails/internal/uploader_field_helpers"
          require "uploadcare/rails/action_view/form_builder"

          ::ActionView::Base.include Uploadcare::Rails::ActionView::UploadcareIncludeTags
          ::ActionView::Base.include Uploadcare::Rails::Internal::UploaderFieldHelpers
        end

        ActiveSupport.on_load :active_record do
          require "uploadcare/rails/internal/active_record_hooks"

          include Uploadcare::Rails::Internal::ActiveRecordHooks
        end

        ActiveSupport.on_load :mongoid do
          require "uploadcare/rails/internal/mongoid_hooks"

          Mongoid::Document.include Uploadcare::Rails::Internal::MongoidHooks
        end
      end

      initializer "uploadcare-rails.active_storage" do
        require "uploadcare/rails/active_storage/integration"

        config.after_initialize do |app|
          previewers = app.config.active_storage.respond_to?(:previewers) ? app.config.active_storage.previewers : nil
          Uploadcare::Rails::ActiveStorage::Integration.install!(previewers: previewers)
        end
      end

      private

      def load_uploadcare_settings!(app)
        merge_uploadcare_settings!(app.config.uploadcare, app.config_for(:uploadcare)) if uploadcare_config_file?(app)
        merge_uploadcare_credentials!(app.config.uploadcare, uploadcare_credentials(app))
      end

      def uploadcare_config_file?(app)
        app.root.join("config/uploadcare.yml").exist?
      end

      def uploadcare_credentials(app)
        credentials = app.credentials
        return {} unless credentials.respond_to?(:dig)

        credentials.dig(:uploadcare) || credentials.dig("uploadcare") || {}
      end

      def merge_uploadcare_credentials!(target, source)
        # config/uploadcare.yml wins; credentials only backfill missing public_key/secret_key values.
        %w[public_key secret_key].each do |key|
          next if target[key].present? || target[key.to_sym].present?

          value = source[key] || source[key.to_sym]
          target[key] = value if value.present?
        end
      end

      def merge_uploadcare_settings!(target, source)
        return if source.nil?

        source.each do |key, value|
          target[key] = value
        end
      end
    end
  end
end
