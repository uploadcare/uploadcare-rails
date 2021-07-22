# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/group_api'

module Uploadcare
  module Rails
    module Api
      RSpec.describe GroupApi do
        subject { Uploadcare::GroupApi }

        context 'when checking methods' do
          it 'responds to expected REST methods' do
            %i[get_groups get_group store_group].each do |method|
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
              uuid = 'aeaeeb8d-43bc-444d-954f-a171fd872e58~2'
              response = subject.store_group(uuid)
              expect(response['id']).to eq(uuid)
            end
          end
        end
      end
    end
  end
end
