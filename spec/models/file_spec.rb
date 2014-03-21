require "spec_helper"

describe Uploadcare::Rails::File do
  before(:all) do
    @uploaded = UPLOADCARE_SETTINGS.api.upload 'http://www.gametech.ru/sadm_images/00jin/2014/march/10/21-03-2014%207-58-17.jpg'
    @cdn_url = @uploaded.cdn_url
  end

  before(:each) do
    @post = Post.new title: "Post title", file: @cdn_url 
    @file = @post.file
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