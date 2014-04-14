require "spec_helper"

describe Uploadcare::Rails::File do
  before(:each) do
    @file = File.open(File.join(File.dirname(__FILE__), '../view.png'))
    @uploaded = UPLOADCARE_SETTINGS.api.upload @file
    @cdn_url = @uploaded.cdn_url

    @post = Post.new title: "Post title", file: @cdn_url
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
    cached = Rails.cache.read @cdn_url
    cached.should be_kind_of(Hash)
    cached["datetime_uploaded"].should be_kind_of(String)
  end

  it "file should stay loaded" do
    @post.file.loaded?.should == false
    @post.file.load!
    @post.file.loaded?.should == true
  end
end