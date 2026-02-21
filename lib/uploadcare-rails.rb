# frozen_string_literal: true

require 'uploadcare/rails/engine'
require 'uploadcare/rails/configuration'
require 'uploadcare/rails/objects/file'
require 'uploadcare/rails/objects/group'
require 'uploadcare/rails/api/rest/file_api'
require 'uploadcare/rails/api/rest/group_api'
require 'uploadcare/rails/api/rest/project_api'
require 'uploadcare/rails/api/rest/webhook_api'
require 'uploadcare/rails/api/rest/conversion_api'
require 'uploadcare/rails/api/rest/file_metadata_api'
require 'uploadcare/rails/api/rest/addons_api'
require 'uploadcare/rails/api/upload/upload_api'

module Uploadcare
  # A root module for the gem
  module Rails
    module_function

    CLIENT_CONFIG_ATTRIBUTES = %i[
      public_key secret_key auth_type multipart_size_threshold rest_api_root upload_api_root
      max_request_tries base_request_sleep max_request_sleep sign_uploads upload_signature_lifetime
      max_throttle_attempts upload_threads framework_data file_chunk_size use_subdomains cdn_base_postfix
      default_cdn_base multipart_chunk_size upload_timeout max_upload_retries
    ].freeze

    def configure
      yield configuration
      overwrite_ruby_config(configuration)
    end

    def overwrite_ruby_config(target_configuration)
      # copy Rails config to Ruby config
      %i[public_key secret_key].each do |param_name|
        value = target_configuration.public_send(param_name)
        Uploadcare.configuration.public_send("#{param_name}=", value) unless value.nil?
      end
    end

    def client_config(public_key:, secret_key:, **options)
      Uploadcare::Configuration.new(public_key: public_key, secret_key: secret_key, **options)
    end

    def serialize_client_config(config)
      return {} unless config

      CLIENT_CONFIG_ATTRIBUTES.each_with_object({}) do |attribute, result|
        result[attribute] = config.public_send(attribute) if config.respond_to?(attribute)
      end.compact
    end

    def build_client_config(config_options = {})
      return Uploadcare.configuration if config_options.blank?

      Uploadcare::Configuration.new(**config_options.symbolize_keys)
    end

    def configuration
      @configuration
    end

    def initialize_config
      @configuration = Uploadcare::Rails::Configuration.instance
    end

    initialize_config
  end
end
