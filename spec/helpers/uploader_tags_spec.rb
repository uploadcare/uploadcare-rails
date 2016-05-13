require "spec_helper"

describe Uploadcare::Rails::ActionView::UploaderTags do
  it "should include uploader tag for name" do
    tag = helper.uploadcare_uploader_tag :file
    tag.should be_kind_of(String)
    tag.should have_selector("input", :type =>"hidden", :role =>"uploadcare-uploader", "data-path-value" => "true")
  end

  it "should include uploader field for object" do
    tag = helper.uploadcare_uploader_field :post, :file
    tag.should be_kind_of(String)
    tag.should have_selector("input", :type =>"hidden", :role =>"uploadcare-uploader", "data-path-value" => "true")
  end
end
