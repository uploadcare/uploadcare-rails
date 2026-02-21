# frozen_string_literal: true

module StubConfigKeys
  extend RSpec::SharedContext

  before do
    allow(Uploadcare.configuration).to receive(:public_key).and_return('demopublickey')
    allow(Uploadcare.configuration).to receive(:secret_key).and_return('demosecretkey')
  end
end
