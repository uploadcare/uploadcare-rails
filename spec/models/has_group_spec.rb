require "spec_helper"

describe :has_uploadcare_group do
  before :each do
    @post = PostWithCollection.new title: "Post title", file: GROUP_CDN_URL 
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

  it 'file should be stored after save' do
    @post.save
    @post.file.stored?.should == true
  end

  # it 'file should be deleted after destroy' do
  #   @post.save if @post.new_record?
  #   @post.destroy
  #   @post.file.deleted?.should == true
  # end
end