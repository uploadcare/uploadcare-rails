require 'spec_helper'

describe :has_uploadcare_group, :vcr do
  let(:post) { PostWithCollection.new(title: 'Title', group: GROUP_1_CDN_URL) }

  after :each do
    Rails.cache.delete(GROUP_1_CDN_URL)
  end

  describe 'object with group' do
    let(:subject) { post }

    it 'should respond to has_uploadcare_file? method' do
      is_expected.to respond_to('has_group_as_uploadcare_file?'.to_sym)
    end

    it 'should respond to has_uploadcare_group? method' do
      is_expected.to respond_to('has_group_as_uploadcare_group?'.to_sym)
    end

    it ':has_uploadcare_file? should return true' do
      is_expected.not_to be_has_group_as_uploadcare_file
    end

    it ':has_uploadcare_group? should return false' do
      is_expected.to be_has_group_as_uploadcare_group
    end
  end

  describe 'object attachment' do
    let(:subject) { post.group }

    it 'should have uploadcare file' do
      is_expected.to be_an(Uploadcare::Rails::Group)
    end

    it 'dont loads group by default' do
      is_expected.not_to be_loaded
    end

    it 'contains files inside' do
      expect(subject.load.files.last).to be_an(Uploadcare::Rails::File)
    end

    it 'stores group after save', vcr: { cassette_name: 'has_uploadcare_group_save' } do
      post.save

      is_expected.to be_stored
    end

    skip 'deletes group after destroy' do
      post.save
      post.group.load
      post.destroy

      expect(post.group).to be_deleted
    end
  end
end
