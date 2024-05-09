# frozen_string_literal: true

module StubConfigKeys
  extend RSpec::SharedContext

  before do
    allow(Uploadcare.config).to receive_message_chain(:public_key).and_return('demopublickey')
    allow(Uploadcare.config).to receive_message_chain(:secret_key).and_return('demosecretkey')
  end
end
