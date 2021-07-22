# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/project_api'

module Uploadcare
  module Rails
    module Api
      RSpec.describe ProjectApi do
        subject { Uploadcare::ProjectApi }

        context 'when checking methods' do
          it 'responds to expected REST methods' do
            expect(subject).to respond_to('get_project')
          end
        end

        context 'when sending requests', :aggregate_failures do
          it 'gets project info' do
            VCR.use_cassette('project_api_get_project') do
              response = subject.get_project
              %w[collaborators name pub_key autostore_enabled].each do |key|
                expect(response).to have_key(key)
              end
            end
          end
        end
      end
    end
  end
end
