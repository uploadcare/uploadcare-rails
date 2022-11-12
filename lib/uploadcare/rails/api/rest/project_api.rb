# frozen_string_literal: true

require 'uploadcare/rails/api/rest/base'

module Uploadcare
  module Rails
    module Api
      module Rest
        # A class that contains Project related methods for Uploadcare REST API
        class ProjectApi < Base
          class << self
            # Get information about the current project.
            # Current project is determined by public and secret keys combination.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/Project
            # rubocop:disable Naming/AccessorMethodName
            def get_project
              Uploadcare::Project.show
            end
            # rubocop:enable Naming/AccessorMethodName
          end
        end
      end
    end
  end
end

Uploadcare::ProjectApi = Uploadcare::Rails::Api::Rest::ProjectApi
