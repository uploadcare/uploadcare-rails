require "spec_helper"

describe Uploadcare::Rails::Group do
  before :each do
    @post = PostWithCollection.new title: "Post title", file: GROUP_CDN_URL
  end

  after :each do
    Rails.cache.delete GROUP_CDN_URL
  end

  it "should be not loaded by default" do
    @post.file.loaded?.should == false
  end

  it "rails cache should be nil" do
    cached = Rails.cache.read @post.file.cdn_url
    cached.should == nil
  end

  it "rails cache should updates after load call" do
    @post.file.load!
    cached = Rails.cache.read GROUP_CDN_URL
    cached.should be_kind_of(Hash)
    cached["datetime_created"].should be_kind_of(String)
  end

  it "group should stay loaded" do
    @post.file.loaded?.should == false
    @post.file.load!
    @post.file.loaded?.should == true
  end

  it 'cached group should contained json representation of files' do
    @post.file.load!
    cached = Rails.cache.read GROUP_CDN_URL
    cached.should be_kind_of(Hash)
    cached["files"].sample.should be_kind_of(Hash)
  end

  it 'group restored from cache should contain Uploadcare::Rails::Files' do
  end
end