require "spec_helper"

describe Uploadcare::Rails::File do

  before :each do
    @post = Post.new title: "Post title", file: FILE_CDN_URL
  end

  after :each do
    Rails.cache.delete FILE_CDN_URL
  end

  it "should be not loaded by default" do
    @post.file.loaded?.should == false
  end

  it "rails cache for unloaded file should be nil" do
    cached = Rails.cache.read @post.file.cdn_url
    cached.should == nil
  end

  it "rails cache should updates after load call" do
    @post.file.load!
    cached = Rails.cache.read FILE_CDN_URL
    cached.should be_kind_of(Hash)
    cached["datetime_uploaded"].should be_kind_of(String)
  end

  it "file should stay loaded" do
    @post.file.loaded?.should == false
    @post.file.load!
    @post.file.loaded?.should == true
  end
end