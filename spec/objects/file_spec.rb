require "spec_helper"

describe Uploadcare::Rails::File do
  before :each do
    @post = Post.new title: "Post title", file: FILE_CDN_URL 
    @file = @post.file
  end

  after :each do
    Rails.cache.delete FILE_CDN_URL
  end

  it "should be Uploadcare::Rails::File" do
    @file.should be_kind_of(Uploadcare::Rails::File)
  end

  it "should be not loaded by default" do
    @file.loaded?.should == false
  end

  it "should load itself" do
    @file.load
    @file.loaded?.should == true
  end

  it "file should respond to :cdn_url and :to_s methods" do
    @file.to_s.should == @file.cdn_url
  end
end