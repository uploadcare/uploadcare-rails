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
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/groupsList
            #
            # valid options:
            # limit: (1..1000)
            # ordering: ["datetime_created"|"-datetime_created"]
            # from: A starting point for filtering group lists. MUST be a datetime value with T used as a separator.
            #   example: '2015-01-02T10:00:00'
            def get_groups(options = {}, config: Uploadcare.configuration)
              Uploadcare::Group.list(params: options, config: config)
            end

            # Get group info
            # @see https://uploadcare.com/api-refs/upload-api/#operation/filesGroupInfo
            def get_group(uuid, config: Uploadcare.configuration)
              upload_client = Uploadcare::UploadClient.new(config: config)
              group_data = Uploadcare::Result.unwrap(upload_client.group_info(group_id: uuid))
              Uploadcare::Group.new(group_data, config)
            end

            # Stores all files in a group
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/Group/paths/~1groups~1%3Cuuid%3E~1storage~1/put
            def store_group(uuid, config: Uploadcare.configuration)
              group = Uploadcare::Group.info(group_id: uuid, config: config)
              Array(group.files).each do |file|
                file_uuid = file.respond_to?(:uuid) ? file.uuid : file['uuid']
                Uploadcare::File.new({ uuid: file_uuid }, config).store
              end
              group
            end

            # Delete a file group by its ID.
            # @see https://uploadcare.com/api-refs/rest-api/v0.7.0/#operation/deleteGroup
            def delete_group(uuid, config: Uploadcare.configuration)
              group = Uploadcare::Group.new({ id: uuid }, config)
              group.delete
            end

            # Create files group from a set of files by using their UUIDs.
            # @see https://uploadcare.com/api-refs/upload-api/#operation/createFilesGroup
            def create_group(files, options = {}, config: Uploadcare.configuration)
              Uploadcare::Group.create(uuids: files, config: config, **options)
            end
          end
        end
      end
    end
  end
end

Uploadcare::GroupApi = Uploadcare::Rails::Api::Rest::GroupApi
