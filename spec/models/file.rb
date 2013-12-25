require "spec_helper"

describe Uploadcare::Rails::File do
  before(:each) do
    @post = Post.new title: "Post title", file: " http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/" 
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