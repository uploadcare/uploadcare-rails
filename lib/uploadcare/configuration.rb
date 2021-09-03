require 'singleton'

module Uploadcare
  class Configuration
    include Singleton

    attr_accessor :public_key, :locale, :live, :manual_start
  end
end
