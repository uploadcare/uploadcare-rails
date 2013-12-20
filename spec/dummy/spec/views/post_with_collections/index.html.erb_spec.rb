require 'spec_helper'

describe "post_with_collections/index" do
  before(:each) do
    assign(:post_with_collections, [
      stub_model(PostWithCollection,
        :title => "Title",
        :file => "File"
      ),
      stub_model(PostWithCollection,
        :title => "Title",
        :file => "File"
      )
    ])
  end

  it "renders a list of post_with_collections" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Title".to_s, :count => 2
    assert_select "tr>td", :text => "File".to_s, :count => 2
  end
end
