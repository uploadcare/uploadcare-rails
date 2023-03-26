# frozen_string_literal: true

require 'uploadcare-rails'

RSpec.describe Uploadcare::Rails do
  it 'has a version number' do
    expect(Uploadcare::Rails::VERSION).not_to be nil
  end

  it 'overwrites ruby config' do
    Uploadcare::Rails.configure do |config|
      config.public_key = 'rails_public_key'
      config.secret_key = 'rails_secret_key'
    end

    expect(Uploadcare.config.public_key).to eq 'rails_public_key'
    expect(Uploadcare.config.secret_key).to eq 'rails_secret_key'
  end
end
