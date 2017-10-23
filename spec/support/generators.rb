require 'rails/generators/test_case'

module Uploadcare
  module Rails
    module Generators
      extend ActiveSupport::Concern

      included do
        cattr_accessor :test_case, :test_case_instance

        self.test_case = Class.new(::Rails::Generators::TestCase) do
          def fake_test_case; end
          def add_assertion; end
        end
        self.test_case_instance = self.test_case.new(:fake_test_case)
        self.test_case.generator_class = described_class
      end

      def prepare_destination
        self.test_case_instance.send :prepare_destination
      end

      def run_generator
        self.test_case_instance.run_generator
      end

      module ClassMethods
        def destination(path)
          self.test_case.destination_root = path
        end
      end
    end
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::Generators, type: :generator
end
