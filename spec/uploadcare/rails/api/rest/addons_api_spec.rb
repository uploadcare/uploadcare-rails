# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/rest/addons_api'

module Uploadcare
  module Rails
    module Api
      module Rest
        RSpec.describe AddonsApi do
          subject { Uploadcare::AddonsApi }

          context 'when checking methods' do
            it 'responds to expected REST methods' do
              %i[virus_scan virus_scan_status rekognition_detect_labels rekognition_detect_labels_status
                 remove_bg remove_bg_status rekognition_detect_moderation_labels
                 rekognition_detect_moderation_labels_status].each do |method|
                expect(subject).to respond_to(method)
              end
            end
          end

          context 'when sending requests' do
            it 'scans the file for viruses' do
              VCR.use_cassette('uc_clamav_virus_scan') do
                uuid = 'ff4d3d37-4de0-4f6d-a7db-8cdabe7fc768'
                params = { purge_infected: true }
                response = subject.virus_scan(uuid, params)
                expect(response.request_id).to eq('34abf037-5384-4e38-bad4-97dd48e79acd')
              end
            end

            it 'checking the status of a virus scanned file' do
              VCR.use_cassette('uc_clamav_virus_scan_status') do
                uuid = '34abf037-5384-4e38-bad4-97dd48e79acd'
                response = subject.virus_scan_status(uuid)
                expect(response.status).to eq('done')
              end
            end

            it 'executes aws rekognition' do
              VCR.use_cassette('ws_rekognition_detect_labels') do
                uuid = 'ff4d3d37-4de0-4f6d-a7db-8cdabe7fc768'
                response = subject.rekognition_detect_labels(uuid)
                expect(response.request_id).to eq('0f4598dd-d168-4272-b49e-e7f9d2543542')
              end
            end

            it 'checking the status of a recognized file' do
              VCR.use_cassette('ws_rekognition_detect_labels_status') do
                uuid = '0f4598dd-d168-4272-b49e-e7f9d2543542'
                response = subject.rekognition_detect_labels_status(uuid)
                expect(response.status).to eq('done')
              end
            end

            it 'executes background image removal' do
              VCR.use_cassette('remove_bg') do
                uuid = 'ff4d3d37-4de0-4f6d-a7db-8cdabe7fc768'
                params = { crop: true, type_level: '2' }
                response = subject.remove_bg(uuid, params)
                expect(response.request_id).to eq('c3446e41-9eb0-4301-aeb4-356d0fdcf9af')
              end
            end

            it 'checking the status background image removal file' do
              VCR.use_cassette('remove_bg_status') do
                uuid = 'c3446e41-9eb0-4301-aeb4-356d0fdcf9af'
                response = subject.remove_bg_status(uuid)
                expect(response.status).to eq('done')
                expect(response.result).to eq({ 'file_id' => 'bc37b996-916d-4ed7-b230-fa71a4290cb3' })
              end
            end

            it 'executes aws rekognition moderation' do
              VCR.use_cassette('ws_rekognition_detect_moderation_labels') do
                uuid = 'ff4d3d37-4de0-4f6d-a7db-8cdabe7fc768'
                response = subject.rekognition_detect_moderation_labels(uuid)
                expect(response.request_id).to eq('0f4598dd-d168-4272-b49e-e7f9d2543542')
              end
            end

            it 'checking the status of aws rekognition moderation recognized file' do
              VCR.use_cassette('ws_rekognition_detect_moderation_labels_status') do
                uuid = '0f4598dd-d168-4272-b49e-e7f9d2543542'
                response = subject.rekognition_detect_moderation_labels_status(uuid)
                expect(response.status).to eq('done')
              end
            end
          end
        end
      end
    end
  end
end
