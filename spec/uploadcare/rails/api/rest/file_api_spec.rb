# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/rest/file_api'

module Uploadcare
  module Rails
    module Api
      module Rest
        RSpec.describe FileApi do
          subject { Uploadcare::FileApi }

          context 'when checking methods' do
            it 'responds to expected REST methods' do
              %i[get_files get_file copy_file delete_file store_file].each do |method|
                expect(subject).to respond_to(method)
              end
            end
          end

          context 'when sending requests' do
            it 'gets file info' do
              VCR.use_cassette('file_api_get_file') do
                uuid = 'c8e24d55-a34f-4caa-afc5-30345635d026'
                file = subject.get_file(uuid)
                expect(file.uuid).to eq(uuid)
              end
            end

            it 'gets files info', :aggregate_failures do
              VCR.use_cassette('file_api_get_files') do
                response = subject.get_files
                %w[next previous total per_page results].each do |key|
                  expect(response).to have_key(key)
                end
                expect(response['results']).not_to be_empty
              end
            end

            it 'copies a file' do
              VCR.use_cassette('file_api_copy_file') do
                uuid = 'd43e8281-a42a-4f30-9fee-4a166998d15a'
                response = subject.copy_file(uuid, store: false)
                expect(response['uuid']).not_to be_nil
                expect(response['uuid']).not_to eq(uuid)
              end
            end

            it 'stores a file' do
              VCR.use_cassette('file_api_store_file') do
                uuid = 'c8e24d55-a34f-4caa-afc5-30345635d026'
                response = subject.store_file(uuid)
                expect(response['uuid']).to eq uuid
              end
            end

            it 'deletes a file' do
              VCR.use_cassette('file_api_delete_file') do
                uuid = 'c8e24d55-a34f-4caa-afc5-30345635d026'
                response = subject.delete_file(uuid)
                expect(response['uuid']).to eq uuid
              end
            end

            it 'stores a batch of files' do
              VCR.use_cassette('file_api_store_files') do
                uuid = '64215d18-1356-42cb-ab8c-7542290b6e1b'
                response = subject.store_files([uuid])
                expect(response['result'].first['uuid']).to eq uuid
              end
            end

            it 'stores a batch of files' do
              VCR.use_cassette('file_api_delete_files') do
                uuid = '37d70281-cc30-4c59-b8d6-e11c472dec40'
                response = subject.delete_files([uuid])
                expect(response['result'].first['uuid']).to eq uuid
              end
            end
          end
        end
      end
    end
  end
end
