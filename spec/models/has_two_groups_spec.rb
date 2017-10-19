require 'spec_helper'

describe :has_uploadcare_group, :vcr do
  let(:post) { PostWithTwoCollections.new(title: 'Title', group_1: GROUP_1_CDN_URL, group_2: GROUP_2_CDN_URL) }
  let(:subject) { post }

  after :each do
    Rails.cache.delete(GROUP_1_CDN_URL)
    Rails.cache.delete(GROUP_2_CDN_URL)
  end

  describe 'object with two groups' do
    it 'should respond to has_uploadcare_file? method' do
      is_expected.to respond_to('has_group_1_as_uploadcare_file?'.to_sym)
      is_expected.to respond_to('has_group_2_as_uploadcare_file?'.to_sym)
    end

    it 'should respond to has_uploadcare_group? method' do
      is_expected.to respond_to('has_group_1_as_uploadcare_group?'.to_sym)
      is_expected.to respond_to('has_group_2_as_uploadcare_group?'.to_sym)
    end

    it ':has_uploadcare_file? should return true' do
      is_expected.not_to be_has_group_1_as_uploadcare_file
      is_expected.not_to be_has_group_2_as_uploadcare_file
    end

    it ':has_uploadcare_group? should return false' do
      is_expected.to be_has_group_1_as_uploadcare_group
      is_expected.to be_has_group_2_as_uploadcare_group
    end
  end

  describe 'object attachment' do
    it 'should have uploadcare file' do
      expect(post.group_1).to be_an(Uploadcare::Rails::Group)
      expect(post.group_2).to be_an(Uploadcare::Rails::Group)
    end

    it 'does not load group by default' do
      expect(post.group_1).not_to be_loaded
      expect(post.group_2).not_to be_loaded
    end

    it 'contains files inside' do
      expect(post.group_1.load.files.last).to be_an(Uploadcare::Rails::File)
      expect(post.group_2.load.files.last).to be_an(Uploadcare::Rails::File)
    end

    it 'stores group after save', vcr: { cassette_name: 'has_uploadcare_group_save' } do
      post.save

      expect(post.group_1).to be_stored
      expect(post.group_2).to be_stored
    end

    skip 'deleteds group after destroy' do
      post.save
      post.group_1.load
      post.group_2.load
      post.destroy

      expect(post.group_1).to be_deleted
      expect(post.group_2).to be_deleted
    end
  end
end
