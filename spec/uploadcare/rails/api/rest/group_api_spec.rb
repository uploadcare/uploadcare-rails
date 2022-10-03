# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/rest/group_api'

module Uploadcare
  module Rails
    module Api
      module Rest
        RSpec.describe GroupApi do
          subject { Uploadcare::GroupApi }

          context 'when checking methods' do
            it 'responds to expected REST methods' do
              %i[get_groups get_group store_group delete_group create_group].each do |method|
                expect(subject).to respond_to(method)
              end
            end
          end

          context 'when sending requests' do
            it 'gets group info' do
              VCR.use_cassette('group_api_get_group') do
                uuid = '8b1362ed-b477-4a15-819a-2c6bb497d8bd~3'
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
                uuid = 'ef40303c-a326-44d1-b12e-4b4b92144fc0~2'
                response = subject.store_group(uuid)
                expect(response['id']).to be_nil
              end
            end

            it 'creates a group' do
              VCR.use_cassette('group_api_create_group') do
                file_ids = %w[f55fcc80-58c1-42eb-9e8f-54d500296d38 4a6ef027-d4cd-49be-a383-8cdbe503aa03]

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
