require 'spec_helper'

describe :has_uploadcare_group, :vcr do
  let(:post) { PostWithCollection.new(
    title: 'Title',
    file: GROUP_CDN_URL,
    other_file: GROUP_2_CDN_URL
  ) }
  let(:subject) { post }

  after :each do
    Rails.cache.delete(GROUP_CDN_URL)
    Rails.cache.delete(GROUP_2_CDN_URL)
  end

  describe 'object with two groups' do
    it 'should respond to has_uploadcare_file? method' do
      is_expected.to respond_to('has_file_as_uploadcare_file?'.to_sym)
      is_expected.to respond_to('has_other_file_as_uploadcare_file?'.to_sym)
    end

    it 'should respond to has_uploadcare_group? method' do
      is_expected.to respond_to('has_file_as_uploadcare_group?'.to_sym)
      is_expected.to respond_to('has_other_file_as_uploadcare_group?'.to_sym)
    end

    it ':has_uploadcare_file? should return true' do
      is_expected.not_to be_has_file_as_uploadcare_file
      is_expected.not_to be_has_other_file_as_uploadcare_file
    end

    it ':has_uploadcare_group? should return false' do
      is_expected.to be_has_file_as_uploadcare_group
      is_expected.to be_has_other_file_as_uploadcare_group
    end
  end

  describe 'object attachment' do
    it 'should have uploadcare file' do
      expect(post.file).to be_an(Uploadcare::Rails::Group)
      expect(post.other_file).to be_an(Uploadcare::Rails::Group)
      expect(post.file.cdn_url).not_to be(post.other_file.cdn_url)
    end

    it 'does not load group by default' do
      expect(post.file).not_to be_loaded
      expect(post.other_file).not_to be_loaded
    end

    it 'contains files inside' do
      expect(post.file.load.files.last).to be_an(Uploadcare::Rails::File)
      expect(post.other_file.load.files.last).to be_an(Uploadcare::Rails::File)
    end

    it 'stores group after save', vcr: { cassette_name: 'has_uploadcare_group_save' } do
      post.save

      expect(post.file).to be_stored
      expect(post.other_file).to be_stored
    end
  end
end
