require "spec_helper"

describe :has_both_file_and_group_spec do
  let(:subject) do
    PostsWithCollectionAndFile.new(
      title: "Post title",
      group: GROUP_1_CDN_URL,
      file: FILE_1_CDN_URL
    )
  end

  after :each do
    Rails.cache.delete FILE_1_CDN_URL
    Rails.cache.delete GROUP_1_CDN_URL
  end

  it 'creates empty post' do
    expect(PostsWithCollectionAndFile.create).to be_persisted
  end

  it "should respond to has_uploadcare_file? method" do
    is_expected.to respond_to("has_file_as_uploadcare_file?".to_sym)
  end

  it "should respond to has_uploadcare_group? method" do
    is_expected.to respond_to("has_group_as_uploadcare_group?".to_sym)
  end

  it ":has_uploadcare_file? should return true" do
    is_expected.to be_has_file_as_uploadcare_file
    is_expected.to be_has_group_as_uploadcare_group
  end

  it ":has_uploadcare_group? should return false" do
    is_expected.not_to be_has_group_as_uploadcare_file
    is_expected.not_to be_has_file_as_uploadcare_group
  end

  it "should have uploadcare file" do
    expect(subject.group).to be_an(Uploadcare::Rails::Group)
    expect(subject.file).to be_an(Uploadcare::Rails::File)
  end
end
