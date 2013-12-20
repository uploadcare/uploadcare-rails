require 'spec_helper'

describe "post_with_collections/show" do
  before(:each) do
    @post_with_collection = assign(:post_with_collection, stub_model(PostWithCollection,
      :title => "Title",
      :file => "File"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Title/)
    rendered.should match(/File/)
  end
end
