require 'spec_helper'

describe Uploadcare::Rails::Group, :vcr do
  let(:post)  { PostWithCollection.new(title: 'Title', file: GROUP_CDN_URL) }

  after :each do
    Rails.cache.delete(GROUP_CDN_URL)
  end

  it 'should be not loaded by default' do
    expect(post.file).not_to be_loaded
  end

  it 'rails cache should be nil' do
    expect(Rails.cache.read(post.file.cdn_url)).to be_nil
  end

  it 'rails cache should updates after load call' do
    post.file.load!
    cached = Rails.cache.read GROUP_CDN_URL

    expect(cached).to be_a(Hash)
    expect(cached['datetime_created']).to be_a(String)
  end

  it 'group should stay loaded' do
    expect(post.file).not_to be_loaded
    post.file.load!
    expect(post.file).to be_loaded
  end

  it 'cached group should contained json representation of files',
    vcr: { cassette_name: 'group_cahsing_file_load'} do
    post.file.load!
    cached = Rails.cache.read GROUP_CDN_URL

    expect(cached).to be_a(Hash)
    expect(cached['files'].sample).to be_a(Hash)
  end
end
