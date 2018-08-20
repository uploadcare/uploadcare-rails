require 'spec_helper'

describe Uploadcare::Rails::Group, :vcr do
  let(:post) { PostWithCollection.new(title: 'Title', group: GROUP_1_CDN_URL) }
  let(:group) { post.group }
  let(:subject) { group }

  describe 'instance' do
    it 'is Uploadcare::Rails::Group' do
      is_expected.to be_an(Uploadcare::Rails::Group)
    end

    it 'is not loaded by default' do
      is_expected.not_to be_loaded
    end

    it 'responds to :uuid and :to_s methods' do
      expect(group.to_s).to eq(subject.uuid)
    end
  end

  describe 'loaded group', vcr: { cassette_name: :load_group} do
    let(:subject) { group.load }

    it 'loads itself' do
      is_expected.to be_loaded
    end

    it 'has files' do
      expect(subject.files).to be_an(Array)
      expect(subject.files.sample).to be_an(Uploadcare::Rails::File)
    end

    it 'loaded group files should be loaded too' do
      expect(subject.files.sample).to be_loaded
    end
  end

  describe 'images workaround' do
    it 'is an array' do
      expect(subject.urls).to be_an(Array)
    end

    it 'builds images url' do
      allow_any_instance_of(Uploadcare::Api).to receive(:options) { {static_url_base: 'http://example.com'} }
      expected = "http://example.com/#{ subject.uuid }/nth/0/-/resize/200x200/"

      expect(subject.urls(size: '200x200').first).to eq(expected)
    end
  end
end
