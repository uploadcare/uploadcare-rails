require "spec_helper"

describe :has_uploadcare_group do
  before(:all) do
    @file = File.open(File.join(File.dirname(__FILE__), 'view.png'))
    @file2 = File.open(File.join(File.dirname(__FILE__), 'view2.jpg'))
    @files_ary = [@file, @file2]
    @files = UPLOADCARE_SETTINGS.api.upload @files_ary
    @uploaded_group = UPLOADCARE_SETTINGS.api.create_group @files
    @uuid = @uploaded_group.uuid
  end

  before(:each) do
    @post = PostWithCollection.new title: "Post title", file: @uuid 
    @method = "file"
  end

  it "should respond to has_uploadcare_file? method" do
    @post.should respond_to("has_#{@method}_as_uploadcare_file?".to_sym)
  end

  it "should respond to has_uploadcare_group? method" do
    @post.should respond_to("has_#{@method}_as_uploadcare_group?".to_sym)
  end

  it ":has_uploadcare_file? should return true" do
    @post.has_file_as_uploadcare_file?.should == false
  end

  it ":has_uploadcare_group? should return false" do
    @post.has_file_as_uploadcare_group?.should == true
  end

  it "should have uploadcare file" do
    @post.file.should be_kind_of(Uploadcare::Rails::Group)
  end

  it "file should not be loaded by default" do
    @post.file.loaded?.should == false
  end
end