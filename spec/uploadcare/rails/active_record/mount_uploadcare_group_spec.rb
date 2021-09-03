# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/active_record/mount_uploadcare_file'
require 'uploadcare/rails/active_record/mount_uploadcare_file_group'

describe Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup do
  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(OpenStruct.new)
    stub_const 'Post', Class.new
    Post.class_eval do
      include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup
      include ActiveRecord::Callbacks

      def initialize
        @gallery = ''
      end

      mount_uploadcare_file_group :gallery
    end
  end

  context 'when checking mount file group methods availability' do
    it 'checks that a model instance responds to mount file group methods', :aggregate_failures do
      post = Post.new
      expect(post).to respond_to(:uploadcare_store_gallery!)
      expect(Post).to respond_to(:has_uploadcare_file_group_for_gallery?)
    end
  end
end
