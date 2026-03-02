# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/active_record/mount_uploadcare_file'
require 'uploadcare/rails/active_record/mount_uploadcare_file_group'
require 'uploadcare/rails/objects/file'

describe Uploadcare::Rails::ActiveRecord::MountUploadcareFile do
  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(OpenStruct.new)
    stub_const('Rails', Class.new) unless defined?(Rails)
    allow(Rails).to receive(:cache).and_return(double(read: nil))
    stub_const 'Post', Class.new
    Post.class_eval do
      include Uploadcare::Rails::ActiveRecord::MountUploadcareFile
      extend ActiveModel::Callbacks

      define_model_callbacks :save, only: :after

      def initialize
        @attributes = { 'picture' => '' }
      end

      def attributes
        @attributes
      end

      def picture=(value)
        @attributes['picture'] = value
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

  context 'when a CDN URL is assigned' do
    it 'builds a file object from the stored attribute', :aggregate_failures do
      post = Post.new
      cdn_url = 'https://ucarecdn.com/bec49a46-7a5b-453c-836e-acc894e50c83/5e6ab92e26d54c7292757fe62537905b1.jpg'

      post.picture = cdn_url
      file = post.picture

      expect(post.attributes['picture']).to eq(cdn_url)
      expect(file).to be_an_instance_of(Uploadcare::Rails::File)
      expect(file.cdn_url).to eq(cdn_url)
      expect(file.uuid).to eq('bec49a46-7a5b-453c-836e-acc894e50c83')
    end
  end
end
