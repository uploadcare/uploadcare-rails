# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/internal/uploader_field_helpers'

describe Uploadcare::Rails::Internal::UploaderFieldHelpers, type: :helper do
  include described_class

  before do
    allow(Uploadcare::Rails).to receive(:configuration).and_return(
      double(uploader_config_attributes: {})
    )
  end

  it 'includes uploader components for model field' do
    tag = uploadcare_file_field(:post, :title)

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
    tag = uploadcare_file_field(:post, :title, multiple: true)

    [
      '<uc-form-input',
      'name="post[title]"',
      '<uc-config',
      'multiple="multiple"',
      '<uc-file-uploader-regular'
    ].each do |fragment|
      expect(tag).to include(fragment)
    end
  end

  it 'includes standalone uploader field tag components' do
    tag = uploadcare_file_field_tag(:title)

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
    tag = uploadcare_file_field_tag(:title, value: 'https://ucarecdn.com/file/', multiple: true)

    expect(tag).to include('multiple="multiple"')
    expect(tag).to match(%r{<uc-form-input[^>]*value="https://ucarecdn.com/file/"})
    expect(tag).not_to match(%r{<uc-config[^>]*value="https://ucarecdn.com/file/"})
    expect(tag).not_to include('data-value=')
  end

  it 'filters unknown config options and keeps custom data-* attributes' do
    logger = double('logger')
    allow(logger).to receive(:warn)
    allow(Rails).to receive(:logger).and_return(logger)

    tag = uploadcare_file_field_tag(:title, **{ unknown_option: 'bad', 'data-qa': 'ok' })

    expect(tag).to include('data-qa="ok"')
    expect(tag).not_to include('unknown-option=')
    expect(logger).to have_received(:warn).with(/unknown-option/)
  end

  describe 'uploadcare_files_field' do
    it 'passes multiple and group_output automatically' do
      tag = uploadcare_files_field(:post, :photos)

      expect(tag).to include('multiple="multiple"')
      expect(tag).to include('group-output="true"')
      expect(tag).to include('name="post[photos]"')
    end
  end

  it 'uses the bound object class to detect group-backed attributes' do
    form_object_class = Class.new do
      def self.has_uploadcare_files_for_photos?
        true
      end

      def errors
        {}
      end
    end

    instance_variable_set(:@post_form, form_object_class.new)

    tag = uploadcare_file_field(:post_form, :photos)

    expect(tag).to include('multiple="multiple"')
  end

  describe 'uploadcare_files_field_tag' do
    it 'passes multiple and group_output automatically' do
      tag = uploadcare_files_field_tag(:photos)

      expect(tag).to include('multiple="multiple"')
      expect(tag).to include('group-output="true"')
      expect(tag).to include('name="photos"')
    end
  end
end
