require "spec_helper"

describe Uploadcare::Rails::ActionView::FormBuilder, type: :helper do
  before :each do
    @post = Post.new
    @form = ActionView::Helpers::FormBuilder.new(:post, @post, helper, {}, nil)
  end

  it "should include uploader tag for name" do
    # not that post has uc file
    tag = @form.uploadcare_field :file
    tag.should be_kind_of(String)
    tag.should have_selector("input", :type => "hidden", "data-multiple" => "false")
  end

  it "should override uploadcare- attribute" do
    tag = @form.uploadcare_field :file, :uploadcare => {:multiple => true}
    tag.should have_selector("input", :type => "hidden", "data-multiple" => "false")
  end

  it "should override data- attribute" do
    tag = @form.uploadcare_field :file, :data => {:multiple => true}
    tag.should have_selector("input", :type => "hidden", "data-multiple" => "false")
  end

  it "should override data- and uploadcare- attributes" do
    tag = @form.uploadcare_field :file, :data => {:multiple => true}, :uploadcare => {:multiple => true}
    tag.should have_selector("input", :type => "hidden", "data-multiple" => "false")
  end
end