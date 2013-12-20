require 'spec_helper'

describe "post_with_collections/edit" do
  before(:each) do
    @post_with_collection = assign(:post_with_collection, stub_model(PostWithCollection,
      :title => "MyString",
      :file => "MyString"
    ))
  end

  it "renders the edit post_with_collection form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", post_with_collection_path(@post_with_collection), "post" do
      assert_select "input#post_with_collection_title[name=?]", "post_with_collection[title]"
      assert_select "input#post_with_collection_file[name=?]", "post_with_collection[file]"
    end
  end
end
