require "spec_helper"

describe :has_both_file_and_group_spec do
  before :each do
    @post = PostsWithCollectionAndFile.new title: "Post title", 
      group: GROUP_CDN_URL, 
      file: FILE_CDN_URL 
    @file_method = "file"
    @group_method = "group"
  end

  after :each do
    Rails.cache.delete FILE_CDN_URL
    Rails.cache.delete GROUP_CDN_URL
  end

  it "should respond to has_uploadcare_file? method" do
    @post.should respond_to("has_#{@file_method}_as_uploadcare_file?".to_sym)
    @post.should respond_to("has_#{@file_method}_as_uploadcare_file?".to_sym)
  end

  it "should respond to has_uploadcare_group? method" do
    @post.should respond_to("has_#{@group_method}_as_uploadcare_group?".to_sym)
    @post.should respond_to("has_#{@group_method}_as_uploadcare_group?".to_sym)
  end

  it ":has_uploadcare_file? should return true" do
    @post.has_file_as_uploadcare_file?.should   == true
    @post.has_group_as_uploadcare_group?.should == true
  end

  it ":has_uploadcare_group? should return false" do
    @post.has_group_as_uploadcare_file?.should == false
    @post.has_file_as_uploadcare_group?.should == false
  end

  it "should have uploadcare file" do
    @post.group.should be_kind_of(Uploadcare::Rails::Group)
    @post.file.should be_kind_of(Uploadcare::Rails::File)
  end
end