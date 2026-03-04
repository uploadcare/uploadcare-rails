# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/action_view/uploadcare_uploader_tags'

describe Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper do
  it 'includes uploader components for model field' do
    tag = uploadcare_uploader_field(:post, :title)

    [
      '<uc-form-input',
      'name="post[title]"',
      '<uc-config',
      '<uc-file-uploader-regular',
      '<uc-upload-ctx-provider'
    ].each do |fragment|
      expect(tag).to include(fragment)
    end
  end

  it 'passes multiple param to uc-config' do
    tag = uploadcare_uploader_field(:post, :title, multiple: true)

    [
      '<uc-form-input',
      'name="post[title]"',
      '<uc-config',
      'multiple="true"',
      '<uc-file-uploader-regular'
    ].each do |fragment|
      expect(tag).to include(fragment)
    end
  end

  it 'includes standalone uploader field tag components' do
    tag = uploadcare_uploader_field_tag(:title)

    [
      '<uc-form-input',
      'name="title"',
      '<uc-config',
      '<uc-file-uploader-regular',
      '<uc-upload-ctx-provider'
    ].each do |fragment|
      expect(tag).to include(fragment)
    end
  end

  it 'does not add legacy value data attributes' do
    tag = uploadcare_uploader_field_tag(:title, value: 'https://ucarecdn.com/file/', multiple: true)

    expect(tag).to include('multiple="true"')
    expect(tag).to include('value="https://ucarecdn.com/file/"')
    expect(tag).not_to include('data-value=')
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper
end
