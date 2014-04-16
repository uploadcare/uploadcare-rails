require "spec_helper"

describe Uploadcare::Rails::Group do
  before :each do
    @post = PostWithCollection.new title: "Post title", file: GROUP_CDN_URL
    @group = @post.file
  end

  after :each do 
    Rails.cache.delete GROUP_CDN_URL
  end

  it "should be Uploadcare::Rails::File" do
    @group.should be_kind_of(Uploadcare::Rails::Group)
  end

  it "should be not loaded by default" do
    @group.loaded?.should == false
  end

  it "should load itself" do
    @group.load
    @group.loaded?.should == true
  end

  it "file should respond to :uuid and :to_s methods" do
    @group.to_s.should == @group.uuid
  end

  it "group should have files" do
    @group.load
    # binding.pry
    @group.files.should be_kind_of(Array)
    @group.files.sample.should be_kind_of(Uploadcare::Rails::File)
  end

  it "loaded group files should be loaded too" do
    @group.load
    @group.files.sample.loaded?.should == true
  end
end