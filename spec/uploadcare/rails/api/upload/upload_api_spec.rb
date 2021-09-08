# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/upload/upload_api'

# These specs include specs from uploadcare-ruby to check proper work with different rails versions.
# They probably will be moved to the uploadcare-ruby gem in future releases.
module Uploadcare
  module Rails
    module Api
      module Upload
        RSpec.describe UploadApi do
          subject { Uploadcare::UploadApi }

          context 'when checking methods' do
            it 'responds to expected REST methods' do
              %i[upload_file upload_files].each do |method|
                expect(subject).to respond_to(method)
              end
            end
          end

          context 'when sending requests' do
            context 'and when uploading a single file' do
              context 'and when uploading is successful' do
                shared_examples 'uploads a single file' do
                  it 'uploads a file' do
                    VCR.use_cassette(cassete) do
                      upload = subject.upload_file(file)
                      expect(upload).to be_kind_of(file_type_in_response)
                    end
                  end
                end

                it_behaves_like 'uploads a single file' do
                  let(:cassete) { 'upload_upload_one_file_from_cdn' }
                  let(:file) { ::File.open('spec/fixtures/kitten.jpeg') }
                  let(:file_type_in_response) { Uploadcare::Entity::File }
                end

                it_behaves_like 'uploads a single file' do
                  let(:cassete) { 'upload_upload_one_file' }
                  let(:file) { 'https://ucarecdn.com/c3328b8f-1b27-48ca-aebe-591924011efc/thumbnail_0.jpg' }
                  let(:file_type_in_response) { Array }
                end
              end

              context 'and when uploading is failed' do
                subject { super().upload_file([]) }

                it 'raises an error' do
                  expect { subject }.to raise_error(TypeError)
                end
              end
            end

            context 'and when uploading a several files' do
              let(:file) { ::File.open('spec/fixtures/kitten.jpeg') }

              context 'and when uploading is successful' do
                it 'uploads a file' do
                  VCR.use_cassette('upload_upload_many_files') do
                    upload = subject.upload_files([file])
                    expect(upload).to be_kind_of(Array)
                  end
                end
              end

              context 'and when uploading is failed' do
                subject { super().upload_files(file) }

                it 'raises an error' do
                  expect { subject }.to raise_error(TypeError)
                end
              end
            end
          end
        end
      end
    end
  end
end
