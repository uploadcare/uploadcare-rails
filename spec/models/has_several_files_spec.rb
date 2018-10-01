require 'spec_helper'

describe :has_two_uploadcare_files, :vcr do
  let(:post) { Post.new(title: 'Post title', file: FILE_CDN_URL, other_file: FILE_2_CDN_URL) }
  let(:subject) { post }

  describe 'object with uploadcare_files' do
    it 'creates blank post' do
      Post.create!
    end

    it 'responds to has_uploadcare_file? method' do
      is_expected.to respond_to(:has_file_as_uploadcare_file?)
      is_expected.to respond_to(:has_other_file_as_uploadcare_file?)
    end

    it 'responds to has_uploadcare_group? method' do
      is_expected.to respond_to(:has_file_as_uploadcare_group?)
      is_expected.to respond_to(:has_other_file_as_uploadcare_group?)
    end

    it 'has Uploadcare::Rails::File' do
      expect(post.file).to be_an(Uploadcare::Rails::File)
      expect(post.other_file).to be_an(Uploadcare::Rails::File)
      expect(post.file.cdn_url).not_to be(post.other_file.cdn_url)
    end

    it 'stores file after save' do
      post.save

      expect(post.file).to be_stored
      expect(post.other_file).to be_stored
    end

    it 'deletes file after destroy', vcr: 'has_upload_care_file_destroy_file' do
      post.save
      post.destroy

      expect(post.file).to be_deleted
      expect(post.other_file).to be_deleted
    end
  end

  context 'instance methods' do
    it '#has_uploadcare_file? returns true' do
      expect(post.has_file_as_uploadcare_file?).to be_truthy
      expect(post.has_other_file_as_uploadcare_file?).to be_truthy
    end

    it '#has_uploadcare_group? returns false' do
      expect(post.has_file_as_uploadcare_group?).to be_falsey
      expect(post.has_other_file_as_uploadcare_group?).to be_falsey
    end
  end
end
