# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/internal/active_record_hooks'
require 'uploadcare/rails/attached_file'
require 'uploadcare/rails/attached_files'

describe Uploadcare::Rails::Internal::ActiveRecordHooks do
  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(OpenStruct.new)
    stub_const('Rails', Class.new) unless defined?(Rails)
    allow(Rails).to receive(:cache).and_return(double(read: nil))
  end

  describe 'has_uploadcare_file' do
    before do
      stub_const 'Post', Class.new
      Post.class_eval do
        include Uploadcare::Rails::Internal::ActiveRecordHooks
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

        has_uploadcare_file :picture
      end
    end

    it 'checks that a model instance responds to mount file methods', :aggregate_failures do
      post = Post.new
      %i[uploadcare_store_picture! uploadcare_delete_picture!].each do |method|
        expect(post).to respond_to(method)
      end
    end

    it 'builds a file object from the stored attribute', :aggregate_failures do
      post = Post.new
      cdn_url = 'https://ucarecdn.com/bec49a46-7a5b-453c-836e-acc894e50c83/5e6ab92e26d54c7292757fe62537905b1.jpg'

      post.picture = cdn_url
      file = post.picture

      expect(post.attributes['picture']).to eq(cdn_url)
      expect(file).to be_an_instance_of(Uploadcare::Rails::AttachedFile)
      expect(file.cdn_url).to eq(cdn_url)
      expect(file.uuid).to eq('bec49a46-7a5b-453c-836e-acc894e50c83')
    end
  end

  describe 'has_uploadcare_files' do
    before do
      stub_const 'Album', Class.new
      Album.class_eval do
        include Uploadcare::Rails::Internal::ActiveRecordHooks
        extend ActiveModel::Callbacks

        define_model_callbacks :save, only: :after

        def initialize
          @attributes = { 'photos' => '' }
        end

        def attributes
          @attributes
        end

        def photos=(value)
          @attributes['photos'] = value
        end

        has_uploadcare_files :photos
      end
    end

    it 'defines has_uploadcare_files_for predicate' do
      expect(Album.has_uploadcare_files_for_photos?).to be(true)
    end

    it 'builds a group object from the stored attribute' do
      album = Album.new
      cdn_url = 'https://ucarecdn.com/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/'

      album.photos = cdn_url
      group = album.photos

      expect(group).to be_an_instance_of(Uploadcare::Rails::AttachedFiles)
      expect(group.cdn_url).to eq(cdn_url)
      expect(group.id).to eq('e6c3fb25-0653-454c-9c8e-7e91902bb044~2')
      expect(group.file_urls).to eq(
        [
          'https://ucarecdn.com/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/nth/0/',
          'https://ucarecdn.com/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/nth/1/'
        ]
      )
    end
  end
end
