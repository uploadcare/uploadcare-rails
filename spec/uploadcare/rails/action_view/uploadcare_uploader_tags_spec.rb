# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/action_view/uploadcare_uploader_tags'

describe Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper do
  it 'includes a hidden field' do
    tag = uploadcare_uploader_field(:post, :title)

    [
      '<input',
      'role="uploadcare-uploader"',
      'type="hidden"',
      'name="post[title]"',
      'id="post_title"',
      '/>'
    ].each do |fragment|
      expect(tag).to include(fragment)
    end
  end

  it 'includes a hidden field tag' do
    tag = uploadcare_uploader_field_tag(:title)

    [
      '<input',
      'role="uploadcare-uploader"',
      'type="hidden"',
      'name="title"',
      'id="title"',
      '/>'
    ].each do |fragment|
      expect(tag).to include(fragment)
    end
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper
end
