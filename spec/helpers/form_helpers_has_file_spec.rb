require "spec_helper"

describe Uploadcare::Rails::ActionView::FormBuilder, type: :helper do
  before :each do
    @post = Post.new
    @form = ActionView::Helpers::FormBuilder.new(:post, @post, helper, {})
  end

  it "should include uploader tag for name" do
    # not that post has uc file
    tag = @form.uploadcare_field :file
    tag.should be_kind_of(String)
    expect(tag).to have_selector('input[type="hidden"][data-multiple="false"]', visible: :all)
  end

  it "should override uploadcare- attribute" do
    tag = @form.uploadcare_field :file, :uploadcare => {:multiple => true}
    expect(tag).to have_selector('input[type="hidden"][data-multiple="false"]', visible: :all)
  end

  it "should override data- attribute" do
    tag = @form.uploadcare_field :file, :data => {:multiple => true}
    expect(tag).to have_selector('input[type="hidden"][data-multiple="false"]', visible: :all)
  end

  it "should override data- and uploadcare- attributes" do
    tag = @form.uploadcare_field :file, :data => {:multiple => true}, :uploadcare => {:multiple => true}
    expect(tag).to have_selector('input[type="hidden"][data-multiple="false"]', visible: :all)
  end
end
