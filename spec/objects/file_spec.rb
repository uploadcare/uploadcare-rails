require "spec_helper"

describe Uploadcare::Rails::File do
  let(:post) { Post.new(title: 'Post title', file: FILE_CDN_URL) }
  let(:subject) { post.file }

  after :each do
    Rails.cache.delete FILE_CDN_URL
  end

  it "should be Uploadcare::Rails::File" do
    is_expected.to be_a(Uploadcare::Rails::File)
  end

  it "should be not loaded by default" do
    is_expected.to_not be_loaded
  end

  it "should load itself" do
    subject.load
    is_expected.to be_loaded
  end

  it "file should respond to :cdn_url and :to_s methods" do
    expect(subject.to_s).to eq(subject.cdn_url)
  end
end
