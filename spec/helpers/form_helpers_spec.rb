require "spec_helper"

describe Uploadcare::Rails::ActionView::FormBuilder, type: :helper do
  before :each do
    @post = Post.new
    @form = ActionView::Helpers::FormBuilder.new(:post, @post, helper, {})
  end

  it "should include uploader tag for name" do
    tag = @form.uploadcare_field :file
    tag.should be_kind_of(String)
  end

  it "should have role attr" do
    tag = @form.uploadcare_field :file, :uploadcare => {:multiple => true}
    expect(tag).to have_selector('input[role="uploadcare-uploader"]', visible: :all)
  end

  it "should have custom data-attributes" do
    tag = @form.uploadcare_field :file, :data => {:custom => true}
    expect(tag).to have_selector('input[data-custom="true"]', visible: :all)
  end

  it "should have uploadcare namespace translated into data- attributes" do
    tag = @form.uploadcare_field :file, :uploadcare => {:custom => true}
    expect(tag).to have_selector('input[data-custom="true"]', visible: :all)
  end

  it "should override data namespace with uploadcare namespace" do
    tag = @form.uploadcare_field :file, :uploadcare => {:custom => true}, :data => {:custom => false}
    expect(tag).to have_selector('input[data-custom="true"]', visible: :all)
  end
end
