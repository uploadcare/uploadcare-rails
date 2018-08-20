require "spec_helper"

describe Uploadcare::Rails::ActionView::FormBuilder, type: :helper do
  before :each do
    @post = PostWithCollection.new
    @form = ActionView::Helpers::FormBuilder.new(:post, @post, helper, {})
  end

  it "should include uploader tag for name" do
    # not that post has uc file
    tag = @form.uploadcare_field :group
    expect(tag).to be_kind_of(String)
    expect(tag).to have_selector('input[type="hidden"][data-multiple="true"]', visible: :all)
  end

  it "should override uploadcare- attribute" do
    tag = @form.uploadcare_field :group, :uploadcare => {:multiple => false}
    expect(tag).to have_selector('input[type="hidden"][data-multiple="true"]', visible: :all)
  end

  it "should override data- attribute" do
    tag = @form.uploadcare_field :group, :data => {:multiple => false}
    expect(tag).to have_selector('input[type="hidden"][data-multiple="true"]', visible: :all)
  end

  it "should override data- and uploadcare- attributes" do
    tag = @form.uploadcare_field :group, :data => {:multiple => false}, :uploadcare => {:multiple => false}
    expect(tag).to have_selector('input[type="hidden"][data-multiple="true"]', visible: :all)
  end
end
