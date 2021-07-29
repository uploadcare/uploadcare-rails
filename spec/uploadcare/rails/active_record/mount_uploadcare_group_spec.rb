# frozen_string_literal: true

require 'spec_helper'
require 'active_record'
require 'uploadcare/errors/mount_error'
require 'uploadcare/rails/active_record/mount_uploadcare_file'
require 'uploadcare/rails/active_record/mount_uploadcare_file_group'

describe Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup do
  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(OpenStruct.new)
    stub_const 'Post', Class.new
    Post.class_eval do
      include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup

      def initialize
        @gallery = ''
      end

      mount_uploadcare_file_group :gallery
    end
  end

  context 'when checking mount file group methods availability' do
    it 'checks that a model instance responds to mount file group methods', :aggregate_failures do
      post = Post.new
      expect(post).to respond_to(:store_gallery!)
      expect(Post).to respond_to(:has_uploadcare_file_group_for_gallery?)
    end
  end

  context 'when checking mounting group and file for the same attribute' do
    it 'raises a MountError error' do
      stub_const 'Post', Class.new
      expect do
        Post.class_eval do
          include Uploadcare::Rails::ActiveRecord::MountUploadcareFile
          include Uploadcare::Rails::ActiveRecord::MountUploadcareFileGroup

          def initialize
            @gallery = ''
          end

          mount_uploadcare_file_group :gallery
          mount_uploadcare_file :gallery
        end
      end.to raise_error(Uploadcare::Errors::MountError)
    end
  end
end
