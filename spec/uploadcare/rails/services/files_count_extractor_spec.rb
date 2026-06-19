# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/services/files_count_extractor'

describe Uploadcare::Rails::FilesCountExtractor, type: :service do
  describe '.call' do
    subject { described_class.call(input_str) }

    context 'when input_str is blank' do
      let(:input_str) { nil }

      it { is_expected.to be_nil }
    end

    context 'when input_str is present' do
      context "when it doesn't contain `~` character" do
        let(:input_str) { 'foobar' }

        it { is_expected.to eq 'foobar' }
      end

      context 'when it contains a `~` character' do
        let(:input_str) { 'foo~bar' }

        it { is_expected.to eq 'bar' }
      end
    end
  end
end
