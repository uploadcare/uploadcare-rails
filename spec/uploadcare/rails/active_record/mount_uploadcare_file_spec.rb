# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/active_record/mount_uploadcare_file'
require 'uploadcare/rails/active_record/mount_uploadcare_file_group'

describe Uploadcare::Rails::ActiveRecord::MountUploadcareFile do
  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(OpenStruct.new)
    stub_const 'Post', Class.new
    Post.class_eval do
      include Uploadcare::Rails::ActiveRecord::MountUploadcareFile
      extend ActiveModel::Callbacks

      define_model_callbacks :save, only: :after

      def initialize
        @picture = ''
      end

      mount_uploadcare_file :picture
    end
  end

  context 'when checking mount file methods availability' do
    it 'checks that a model instance responds to mount file methods', :aggregate_failures do
      post = Post.new
      %i[uploadcare_store_picture! uploadcare_delete_picture!].each do |method|
        expect(post).to respond_to(method)
      end
    end
  end
end
