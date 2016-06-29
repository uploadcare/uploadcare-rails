require 'spec_helper'

describe :has_uploadcare_file, :vcr do
  let(:post) { Post.new(title: 'Post title', file: FILE_CDN_URL) }
  let(:subject) { post }
  let(:method) { 'file' }

  describe 'object with uploadcare_file' do
    it 'responds to has_uploadcare_file? method' do
      is_expected.to respond_to(:has_file_as_uploadcare_file?)
    end

    it 'responds to has_uploadcare_group? method' do
      is_expected.to respond_to(:has_file_as_uploadcare_group?)
    end

    it 'has Uploadcare::Rails::File' do
      expect(post.file).to be_an(Uploadcare::Rails::File)
    end

    it 'stores file after save' do
      post.save
      expect(post.file).to be_stored
    end

    it 'deletes file after destroy',
      vcr: 'has_upload_care_file_destroy_file' do
      post.save
      post.destroy
      expect(post.file).to be_deleted
    end
  end

  context 'instanse methods' do
    it '#has_uploadcare_file? returns true' do
      expect(post.has_file_as_uploadcare_file?).to be_truthy
    end

    it '#has_uploadcare_group? returns false' do
      expect(post.has_file_as_uploadcare_group?).to be_falsey
    end
  end
end
