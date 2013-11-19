require 'spec_helper'

describe Uploadcare::Rails do
  it "should include uploader tag for name" do
    tag = helper.uploadcare_uploader_tag :file
    tag.should be_kind_of(String)
  end

  it "should include uploader field for object" do
    tag = helper.uploadcare_uploader_field :post, :file
    tag.should be_kind_of(String)
  end
end