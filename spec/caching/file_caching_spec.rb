require 'spec_helper'

describe Uploadcare::Rails::File, :vcr do
  let(:post) { Post.new(title: 'Post title', file: FILE_1_CDN_URL) }

  context 'when object is not persisted' do
    it 'its file is not loaded' do
      expect(post.file).not_to be_loaded
    end
  end

  skip { expect(Rails.cache.read(post.file.cdn_url)).to be_nil }

  skip 'rails cache should updates after load call' do
    post.file.load!
    cached = Rails.cache.read FILE_1_CDN_URL
    cached.should be_kind_of(Hash)
    cached['datetime_uploaded'].should be_kind_of(String)
  end

  skip 'file should stay loaded' do
    post.file.loaded?.should == false
    post.file.load!
    post.file.loaded?.should == true
  end
end
