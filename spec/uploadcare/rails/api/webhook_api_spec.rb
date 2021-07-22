# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/webhook_api'

module Uploadcare
  module Rails
    module Api
      RSpec.describe WebhookApi do
        subject { Uploadcare::WebhookApi }

        context 'when checking methods' do
          it 'responds to expected REST methods' do
            %i[get_webhooks create_webhook update_webhook delete_webhook].each do |method|
              expect(subject).to respond_to(method)
            end
          end
        end

        context 'when sending requests', :aggregate_failures do
          it 'gets webhooks info' do
            VCR.use_cassette('webhook_api_get_webhooks') do
              response = subject.get_webhooks
              expect(response).not_to be_empty
            end
          end

          it 'creates a webhook', :aggregate_failures do
            VCR.use_cassette('webhook_api_create_webhook') do
              response = subject.create_webhook('https://ucarecdn.com/3542c513-5cf4-4adb-97b0-bfa7fbd31fb5/11.png')
              %w[id created updated event target_url project is_active].each do |key|
                expect(response).to have_key(key)
              end
            end
          end

          xit 'updates a webhook', :aggregate_failures do
            VCR.use_cassette('webhook_api_update_webhook') do
              new_target_url = 'https://ucarecdn.com/3542c513-5cf4-4adb-97b0-bfa7fbd31fb5/11.png'
              response = subject.update_webhook('811134', target_url: new_target_url, is_active: false)
              expect(response['target_url']).to eq(new_target_url)
              expect(response['is_active']).to eq(false)
            end
          end

          it 'deletes a webhook', :aggregate_failures do
            VCR.use_cassette('webhook_api_delete_webhook') do
              target_url = 'https://ucarecdn.com/3542c513-5cf4-4adb-97b0-bfa7fbd31fb5/11.png'
              response = subject.delete_webhook(target_url)
              expect(response).to be_success
            end
          end
        end
      end
    end
  end
end
