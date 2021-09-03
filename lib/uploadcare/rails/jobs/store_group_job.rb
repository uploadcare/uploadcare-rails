# frozen_string_literal: true

require 'active_job'

module Uploadcare
  module Rails
    # A job storing group files to Uploadcare
    class StoreGroupJob < ActiveJob::Base
      def perform(group_id)
        Uploadcare::GroupApi.store_group(group_id) if group_id
      end
    end
  end
end
