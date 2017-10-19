require 'spec_helper'

describe Uploadcare::Rails::Group, :vcr do
  let(:post)  { PostWithCollection.new(title: 'Title', group: GROUP_1_CDN_URL) }

  after :each do
    Rails.cache.delete(GROUP_1_CDN_URL)
  end

  it 'should be not loaded by default' do
    expect(post.group).not_to be_loaded
  end

  it 'rails cache should be nil' do
    expect(Rails.cache.read(post.group.cdn_url)).to be_nil
  end

  it 'rails cache should updates after load call' do
    post.group.load!
    cached = Rails.cache.read GROUP_1_CDN_URL

    expect(cached).to be_a(Hash)
    expect(cached['datetime_created']).to be_a(String)
  end

  it 'group should stay loaded' do
    expect(post.group).not_to be_loaded
    post.group.load!
    expect(post.group).to be_loaded
  end

  it 'cached group should contained json representation of files',
    vcr: { cassette_name: 'group_caching_file_load'} do
    post.group.load!
    cached = Rails.cache.read GROUP_1_CDN_URL

    expect(cached).to be_a(Hash)
    expect(cached['files'].sample).to be_a(Hash)
  end
end
