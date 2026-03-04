# frozen_string_literal: true

require "uploadcare/rails/version"

module Uploadcare
  module Rails
    # Base error class for uploadcare-rails runtime failures.
    class Error < StandardError; end
  end
end
