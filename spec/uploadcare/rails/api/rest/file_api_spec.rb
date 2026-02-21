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
              %i[get_files get_file delete_file store_file local_copy_file remote_copy_file store_files
                 delete_files].each do |method|
                expect(subject).to respond_to(method)
              end
            end
          end

          context 'when passing custom config' do
            let(:custom_config) { Uploadcare::Configuration.new(public_key: 'pk', secret_key: 'sk') }

            it 'forwards config to get_file' do
              expect(Uploadcare::File).to receive(:info).with(uuid: 'uuid', config: custom_config)

              subject.get_file('uuid', config: custom_config)
            end

            it 'forwards config to get_files' do
              expect(Uploadcare::File).to receive(:list).with(options: { limit: 10 }, config: custom_config)

              subject.get_files({ limit: 10 }, config: custom_config)
            end

            it 'forwards config to local_copy_file' do
              expect(Uploadcare::File).to receive(:local_copy).with(source: 'source', options: { store: true },
                                                                    config: custom_config)

              subject.local_copy_file('source', { store: true }, config: custom_config)
            end

            it 'forwards config to remote_copy_file' do
              expect(Uploadcare::File).to receive(:remote_copy)
                .with(source: 'source', target: 'target', options: { make_public: true }, config: custom_config)

              subject.remote_copy_file('source', 'target', { make_public: true }, config: custom_config)
            end
          end

          context 'when sending requests' do
            it 'gets file info' do
              VCR.use_cassette('file_api_get_file') do
                uuid = '2254146d-3652-4419-abf6-305d36ef30a8'
                file = subject.get_file(uuid)
                expect(file.uuid).to eq(uuid)
              end
            end

            it 'gets files info', :aggregate_failures do
              VCR.use_cassette('file_api_get_files') do
                response = subject.get_files
                expect(response).to be_a(Uploadcare::PaginatedCollection)
                expect(response.resources).not_to be_empty
              end
            end

            it 'stores a file' do
              VCR.use_cassette('file_api_store_file') do
                uuid = '2254146d-3652-4419-abf6-305d36ef30a8'
                response = subject.store_file(uuid)
                expect(response.uuid).to eq(uuid)
              end
            end

            it 'deletes a file' do
              VCR.use_cassette('file_api_delete_file') do
                uuid = '2254146d-3652-4419-abf6-305d36ef30a8'
                response = subject.delete_file(uuid)
                expect(response.uuid).to eq(uuid)
              end
            end

            it 'stores a batch of files' do
              VCR.use_cassette('file_api_store_files') do
                uuid = '64215d18-1356-42cb-ab8c-7542290b6e1b'
                response = subject.store_files([uuid])
                expect(response).to be_a(Uploadcare::BatchFileResult)
                expect(response.result).to be_a(Array)
                expect(response.problems).to be_a(Hash)
              end
            end

            it 'stores a batch of files' do
              VCR.use_cassette('file_api_delete_files') do
                uuid = '37d70281-cc30-4c59-b8d6-e11c472dec40'
                response = subject.delete_files([uuid])
                expect(response).to be_a(Uploadcare::BatchFileResult)
                expect(response.result).to be_a(Array)
                expect(response.problems).to be_a(Hash)
              end
            end
          end
        end
      end
    end
  end
end
