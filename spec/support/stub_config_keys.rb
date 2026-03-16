# frozen_string_literal: true

module StubConfigKeys
  extend RSpec::SharedContext

  before do
    Uploadcare.configure do |config|
      config.public_key = 'demopublickey'
      config.secret_key = 'demosecretkey'
    end
  end
end
