require "spec_helper"

describe Uploadcare::Rails::File, :vcr do
  let(:post) { Post.new(title: "Post title", file: FILE_1_CDN_URL) }
  let(:file) { post.file }

  after :each do
    Rails.cache.delete FILE_1_CDN_URL
  end

  it "should be Uploadcare::Rails::File" do
    expect(file).to be_a(Uploadcare::Rails::File)
  end

  it "should be not loaded by default" do
    expect(file).not_to be_loaded
  end

  it "should load itself" do
    file.load
    expect(file).to be_loaded
  end

  it "file should respond to :cdn_url and :to_s methods" do
    expect(file.to_s).to eq file.cdn_url
  end
end
