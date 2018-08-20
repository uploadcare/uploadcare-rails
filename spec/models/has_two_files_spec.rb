require 'spec_helper'

describe :has_two_uploadcare_files, :vcr do
  let(:post) { PostWithTwoFiles.new(title: 'Post title', file_1: FILE_1_CDN_URL, file_2: FILE_2_CDN_URL) }
  let(:subject) { post }

  describe 'object with uploadcare_files' do
    it 'creates blank post' do
      PostWithTwoFiles.create!
    end

    it 'responds to has_uploadcare_file? method' do
      is_expected.to respond_to(:has_file_1_as_uploadcare_file?)
      is_expected.to respond_to(:has_file_2_as_uploadcare_file?)
    end

    it 'responds to has_uploadcare_group? method' do
      is_expected.to respond_to(:has_file_1_as_uploadcare_group?)
      is_expected.to respond_to(:has_file_2_as_uploadcare_group?)
    end

    it 'has Uploadcare::Rails::File' do
      expect(post.file_1).to be_an(Uploadcare::Rails::File)
      expect(post.file_2).to be_an(Uploadcare::Rails::File)
    end

    it 'stores file after save' do
      post.save

      expect(post.file_1).to be_stored
      expect(post.file_2).to be_stored
    end

    it 'deletes file after destroy', vcr: 'has_upload_care_file_destroy_file' do
      post.save
      post.destroy

      expect(post.file_1).to be_deleted
      expect(post.file_2).to be_deleted
    end
  end

  context 'instance methods' do
    it '#has_uploadcare_file? returns true' do
      expect(post.has_file_1_as_uploadcare_file?).to be_truthy
      expect(post.has_file_2_as_uploadcare_file?).to be_truthy
    end

    it '#has_uploadcare_group? returns false' do
      expect(post.has_file_1_as_uploadcare_group?).to be_falsey
      expect(post.has_file_2_as_uploadcare_group?).to be_falsey
    end
  end
end
