# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/rest/group_api'

module Uploadcare
  module Rails
    module Api
      module Rest
        RSpec.describe GroupApi do
          subject { Uploadcare::GroupApi }

          around do |example|
            previous_value = Uploadcare.config.public_key
            Uploadcare.config.public_key = 'demopublickey'
            example.run
            Uploadcare.config.public_key = previous_value
          end

          context 'when checking methods' do
            it 'responds to expected REST methods' do
              %i[get_groups get_group store_group create_group].each do |method|
                expect(subject).to respond_to(method)
              end
            end
          end

          context 'when sending requests' do
            it 'gets group info' do
              VCR.use_cassette('group_api_get_group') do
                uuid = '6053b054-b8d4-4f57-992d-94b8f1d6ba65~2'
                response = subject.get_group(uuid)
                expect(response['id']).to eq(uuid)
              end
            end

            it 'gets groups info', :aggregate_failures do
              VCR.use_cassette('group_api_get_groups') do
                response = subject.get_groups
                %w[next previous total per_page results].each do |key|
                  expect(response).to have_key(key)
                end
                expect(response['results']).not_to be_empty
              end
            end

            it 'stores a group' do
              VCR.use_cassette('group_api_store_group') do
                uuid = '6053b054-b8d4-4f57-992d-94b8f1d6ba65~2'
                response = subject.store_group(uuid)
                expect(response).to eq('200 OK')
              end
            end

            it 'creates a group' do
              VCR.use_cassette('group_api_create_group') do
                file_ids = %w[272cbffa-4a27-4aba-98f1-a36e2e017e24 36892dd8-ccb1-4225-bc48-96a0fde93b33]

                response = subject.create_group(file_ids.map { |f| "#{f}/resize/x600" })
                expect(response['files'].map { |f| f['file_id'] }).to contain_exactly(*file_ids)
              end
            end
          end
        end
      end
    end
  end
end
