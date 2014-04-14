require "spec_helper"

describe Uploadcare::Rails::Group do
  before(:each) do
      @file = File.open(File.join(File.dirname(__FILE__), '../view.png'))
      @file2 = File.open(File.join(File.dirname(__FILE__), '../view2.jpg'))
      @files_ary = [@file, @file2]
      @files = UPLOADCARE_SETTINGS.api.upload @files_ary
      @uploaded_group = UPLOADCARE_SETTINGS.api.create_group @files
      @cdn_url = @uploaded_group.cdn_url
      @post = PostWithCollection.new title: "Post title", file: @cdn_url 
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
    cached = Rails.cache.read @cdn_url
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
    cached = Rails.cache.read @cdn_url
    cached.should be_kind_of(Hash)
    cached["files"].sample.should be_kind_of(Hash)
  end

  it 'group restored from cache should contain Uploadcare::Rails::Files' do
  end
end