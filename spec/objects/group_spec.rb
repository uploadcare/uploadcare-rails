require "spec_helper"

describe Uploadcare::Rails::Group do
  let(:post) do
    PostWithCollection.new(file: GROUP_CDN_URL)
  end

  let(:subject) { post.file }

  after :each do
    Rails.cache.delete GROUP_CDN_URL
  end

  it { is_expected.not_to be_loaded }

  it "should be Uploadcare::Rails::File" do
    is_expected.to be_a(Uploadcare::Rails::Group)
  end

  it "file should respond to :uuid and :to_s methods" do
    expect(subject.to_s).to eq(subject.uuid)
  end

  describe 'when file loaded' do
    let(:subject) { post.file.load }

    it { is_expected.to be_loaded }

    it "group should have files" do
      expect(subject.files).to be_an(Array)
      expect(subject.files.sample).to be_a(Uploadcare::Rails::File)
    end

    it "loaded group files should be loaded too" do
      expect(subject.files.sample).to be_loaded
    end
  end
end
