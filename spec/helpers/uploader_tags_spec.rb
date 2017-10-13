require "spec_helper"

describe Uploadcare::Rails::ActionView::UploaderTags do
  let(:expected_selector) do
    'input[type="hidden"][role="uploadcare-uploader"][data-path-value="true"]'
  end

  it "should include uploader tag for name" do
    tag = helper.uploadcare_uploader_tag :file

    expect(tag).to be_kind_of(String)
    expect(tag).to have_selector(expected_selector, visible: :all)
  end

  it "should include uploader field for object" do
    tag = helper.uploadcare_uploader_field :post, :file

    expect(tag).to be_kind_of(String)
    expect(tag).to have_selector(expected_selector, visible: :all)
  end
end
