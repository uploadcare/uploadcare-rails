# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/internal/active_record_hooks'

describe Uploadcare::Rails::Internal::ActiveRecordHooks, 'group macros' do
  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(OpenStruct.new)
    stub_const 'Post', Class.new
    Post.class_eval do
      include Uploadcare::Rails::Internal::ActiveRecordHooks
      extend ActiveModel::Callbacks

      define_model_callbacks :save, only: :after

      def initialize
        @attributes = { 'gallery' => '' }
      end

      def attributes
        @attributes
      end

      has_uploadcare_files :gallery
    end
  end

  context 'when checking mount file group methods availability' do
    it 'checks that a model instance responds to mount file group methods', :aggregate_failures do
      post = Post.new
      expect(post).to respond_to(:uploadcare_store_gallery!)
      expect(Post).to respond_to(:has_uploadcare_files_for_gallery?)
    end
  end

  describe 'GROUP_ID_REGEX' do
    it 'properly extracts out group id from the cdn url' do
      extracted_group_id = Uploadcare::Rails::IdExtractor.call(
        'https://ucarecdn.com/dc140069-62b1-4ee0-b603-18e2062e26e4~11/', Uploadcare::Rails::Internal::ModelMacros::GROUP_ID_REGEX
      )
      expect(extracted_group_id).to eq('dc140069-62b1-4ee0-b603-18e2062e26e4~11')

      extracted_group_id = Uploadcare::Rails::IdExtractor.call(
        'https://ucarecdn.com/dc140069-62b1-4ee0-b603-18e2062e26e4~1/', Uploadcare::Rails::Internal::ModelMacros::GROUP_ID_REGEX
      )
      expect(extracted_group_id).to eq('dc140069-62b1-4ee0-b603-18e2062e26e4~1')
    end
  end

end
