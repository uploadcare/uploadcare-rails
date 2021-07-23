# frozen_string_literal: true

require 'uploadcare/rails/api/rest/base'

module Uploadcare
  module Rails
    module Api
      module Rest
        # A class that contains Group related methods for Uploadcare REST API
        class GroupApi < Base
          class << self
            # Returns paginated list of groups
            # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#operation/groupsList
            #
            # valid options:
            # limit: (1..1000)
            # ordering: ["datetime_created"|"-datetime_created"]
            # from: A starting point for filtering group lists. MUST be a datetime value with T used as a separator.
            #   example: '2015-01-02T10:00:00'
            def get_groups(**options)
              Uploadcare::GroupList.list(**options)
            end

            # Get group info
            # @see https://uploadcare.com/api-refs/upload-api/#operation/filesGroupInfo
            def get_group(uuid)
              Uploadcare::Group.info(uuid)
            end

            # Stores all files in a group
            # @see https://uploadcare.com/api-refs/rest-api/v0.5.0/#tag/Group/paths/~1groups~1%3Cuuid%3E~1storage~1/put
            def store_group(uuid)
              Uploadcare::Group.store(uuid)
            end
          end
        end
      end
    end
  end
end

Uploadcare::GroupApi = Uploadcare::Rails::Api::Rest::GroupApi
