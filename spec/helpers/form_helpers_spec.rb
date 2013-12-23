require "spec_helper"

describe Uploadcare::Rails::ActionView::FormBuilder, type: :helper do
  before(:each) do
    @post = Post.new
    @form = ActionView::Helpers::FormBuilder.new(:post, @post, helper, {}, nil)
  end

  it "should include uploader tag for name" do
    tag = @form.uploadcare_field :file
    tag.should be_kind_of(String)
  end

  it "should have role attr" do
    tag = @form.uploadcare_field :file, :uploadcare => {:multiple => true}
    tag.should have_selector("input", :role => "uploadcare-uploader")
  end

  it "should have custom data-attributes" do
    tag = @form.uploadcare_field :file, :data => {:custom => true}
    tag.should have_selector("input", "data-custom" => "true")
  end

  it "should have uploadcare namespace translated into data- attributes" do
    tag = @form.uploadcare_field :file, :uploadcare => {:custom => true}
    tag.should have_selector("input", "data-custom" => "true")
  end

  it "should override data namespace with uploadcare namespace" do
    tag = @form.uploadcare_field :file, :uploadcare => {:custom => true}, :data => {:custom => false}
    tag.should have_selector(:input, "data-custom" => "true")
  end
end