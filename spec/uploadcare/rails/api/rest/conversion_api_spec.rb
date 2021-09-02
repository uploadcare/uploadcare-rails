# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/rest/conversion_api'

# These specs include specs from uploadcare-ruby to check proper work with different rails versions.
# They probably will be moved to the uploadcare-ruby gem in future releases.
module Uploadcare
  module Rails
    module Api
      module Rest
        RSpec.describe ConversionApi do
          subject { Uploadcare::ConversionApi }

          context 'when checking methods' do
            it 'responds to expected REST methods' do
              %i[convert_video get_video_conversion_status convert_document get_document_conversion_status].each do |m|
                expect(subject).to respond_to(m)
              end
            end
          end

          xcontext 'when sending requests', :aggregate_failures do
            context 'and when converting a video' do
              let(:uuid) { '169d4bf8-206d-4fa1-8aca-a3aaa73c5cf5' }

              context 'and when request is succeeded' do
                it 'converts a video' do
                  VCR.use_cassette('conversion_api_convert_video') do
                    params = {
                      uuid: uuid,
                      size: { resize_mode: 'change_ratio', width: '600', height: '400' },
                      quality: 'best',
                      format: 'ogg',
                      cut: { start_time: '0:0:0.0', length: '0:0:1.0' },
                      thumbs: { N: 2, number: 1 }
                    }
                    response = subject.convert_video(params, store: false)
                    expect(response).to be_success
                    expect(response.success[:problems]).to be_empty
                  end
                end

                it 'gets a video conversion job status' do
                  VCR.use_cassette('conversion_api_get_video_conversion_status') do
                    token = '913632082'
                    response = subject.get_video_conversion_status(token)
                    expect(response).to be_success
                    expect(response.success[:error]).to be_nil
                  end
                end
              end

              context 'and when request is failed' do
                it 'raises a conversion error' do
                  VCR.use_cassette('conversion_api_convert_video_with_error') do
                    params = {
                      uuid: uuid,
                      size: { resize_mode: 'change_ratio' }
                    }
                    expect { subject.convert_video(params, store: false) }
                      .to raise_error(Uploadcare::Exception::ConversionError)
                  end
                end
              end
            end

            context 'and when converting a document' do
              let(:uuid) { '86c54d9a-3453-4b12-8dcc-49883ae8f084' }

              context 'and when request is succeeded' do
                it 'converts a video' do
                  VCR.use_cassette('conversion_api_convert_document') do
                    params = {
                      uuid: '86c54d9a-3453-4b12-8dcc-49883ae8f084',
                      format: 'pdf'
                    }
                    response = subject.convert_document(params, store: false)
                    expect(response).to be_success
                    expect(response.success[:problems]).to be_empty
                  end
                end

                it 'gets a document conversion job status' do
                  VCR.use_cassette('conversion_api_get_document_conversion_status') do
                    token = '21201727'
                    response = subject.get_document_conversion_status(token)
                    expect(response).to be_success
                    expect(response.success[:error]).to be_nil
                  end
                end
              end

              context 'and when request is failed' do
                it 'raises a conversion error' do
                  VCR.use_cassette('conversion_api_convert_document_with_error') do
                    params = {
                      uuid: uuid,
                      format: 'jpg'
                    }
                    expect { subject.convert_document(params, store: false) }
                      .to raise_error(Uploadcare::Exception::ConversionError)
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
