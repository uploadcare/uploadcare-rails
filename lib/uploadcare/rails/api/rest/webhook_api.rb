# frozen_string_literal: true

require 'uploadcare/rails/api/rest/base'

module Uploadcare
  module Rails
    module Api
      module Rest
        # A class that contains Webhook related methods for Uploadcare REST API
        class WebhookApi < Base
          class << self
            # Returns a list (not paginated) of webhooks
            # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/webhooksList
            # rubocop:disable Naming/AccessorMethodName
            def get_webhooks
              Uploadcare::Webhook.list
            end
            # rubocop:enable Naming/AccessorMethodName

            # Create a webhook
            # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/webhookCreate
            def create_webhook(target_url, event: 'file.uploaded', is_active: true)
              options = { target_url: target_url, event: event, is_active: is_active }
              Uploadcare::Webhook.create(target_url, event: event, is_active: is_active)
            end

            # Updates a webhook
            # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/updateWebhook
            def update_webhook(id, **options)
              Uploadcare::Webhook.update(id, **options)
            end

            # Permanently deletes a webhook
            # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/webhookUnsubscribe
            def delete_webhook(target_url)
              Uploadcare::Webhook.delete(target_url)
            end
          end
        end
      end
    end
  end
end

Uploadcare::WebhookApi = Uploadcare::Rails::Api::Rest::WebhookApi
