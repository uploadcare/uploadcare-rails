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
            %i[get_groups get_group].each do |method|
              expect(subject).to respond_to(method)
            end
          end
        end

        context 'when sending requests' do
          it 'gets group info' do
            VCR.use_cassette('group_api_get_group') do
              uuid = '38483b4e-57fe-40e7-8e52-74fbdd73da14~2'
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
          #
          # it 'stores a file' do
          #   VCR.use_cassette('file_api_store_file') do
          #     uuid = '5ae54c37-754c-4982-8de4-3f242a88ce17'
          #     response = subject.store_file(uuid)
          #     expect(response['uuid']).to eq uuid
          #   end
          # end
          #
          # it 'deletes a file' do
          #   VCR.use_cassette('file_api_delete_file') do
          #     uuid = '5ae54c37-754c-4982-8de4-3f242a88ce17'
          #     response = subject.delete_file(uuid)
          #     expect(response['uuid']).to eq uuid
          #   end
          # end
          #
          # it 'stores a batch of files' do
          #   VCR.use_cassette('file_api_store_files') do
          #     uuid = '64215d18-1356-42cb-ab8c-7542290b6e1b'
          #     response = subject.store_files([uuid])
          #     expect(response['result'].first['uuid']).to eq uuid
          #   end
          # end
          #
          # it 'stores a batch of files' do
          #   VCR.use_cassette('file_api_delete_files') do
          #     uuid = '37d70281-cc30-4c59-b8d6-e11c472dec40'
          #     response = subject.delete_files([uuid])
          #     expect(response['result'].first['uuid']).to eq uuid
          #   end
          # end
        end
      end
    end
  end
end
