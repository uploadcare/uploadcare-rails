# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/api/rest/project_api'

module Uploadcare
  module Rails
    module Api
      module Rest
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
                expect(response).to be_a(Uploadcare::Project)
                expect(response.collaborators).to be_a(Array)
                expect(response.name).to be_a(String)
                expect(response.pub_key).to be_a(String)
              end
            end
          end
        end
      end
    end
  end
end
