# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/action_view/uploadcare_include_tags'

RSpec.describe Uploadcare::Rails::ActionView::UploadcareIncludeTags, type: :helper do
  describe '#uploadcare_include_tag' do
    context 'with default options' do
      it 'includes CSS stylesheet from CDN' do
        tag = uploadcare_include_tag

        expect(tag).to include('href="https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.css"')
        expect(tag).to include('rel="stylesheet"')
      end

      it 'includes JS module from CDN' do
        tag = uploadcare_include_tag

        expect(tag).to include('type="module"')
        expect(tag).to include("import * as UC from 'https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/file-uploader.min.js'")
        expect(tag).to include('UC.defineComponents(UC)')
      end
    end

    context 'with custom version' do
      it 'uses the specified version in URLs' do
        tag = uploadcare_include_tag(version: 'v2')

        expect(tag).to include('@uploadcare/file-uploader@v2/web')
      end
    end

    context 'with different solutions' do
      %w[regular inline minimal].each do |solution|
        it "includes CSS for #{solution} solution" do
          tag = uploadcare_include_tag(solution: solution)

          expect(tag).to include("uc-file-uploader-#{solution}.min.css")
        end
      end
    end

    context 'with non-minified version' do
      it 'excludes .min from URLs when min is false' do
        tag = uploadcare_include_tag(min: false)

        expect(tag).to include('file-uploader.js')
        expect(tag).not_to include('file-uploader.min.js')
        expect(tag).to include('uc-file-uploader-regular.css')
        expect(tag).not_to include('uc-file-uploader-regular.min.css')
      end
    end

    context 'with importmap mode' do
      it 'includes only CSS when importmap is true' do
        tag = uploadcare_include_tag(importmap: true)

        expect(tag).to include('rel="stylesheet"')
        expect(tag).to include('uc-file-uploader-regular.min.css')
        expect(tag).not_to include('<script')
        expect(tag).not_to include('import')
      end
    end
  end

  describe '#uploadcare_stylesheet_tag' do
    it 'includes only CSS stylesheet from CDN' do
      tag = uploadcare_stylesheet_tag

      expect(tag).to include('href="https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.css"')
      expect(tag).to include('rel="stylesheet"')
      expect(tag).not_to include('<script')
    end

    it 'supports different solutions' do
      tag = uploadcare_stylesheet_tag(solution: 'inline')

      expect(tag).to include('uc-file-uploader-inline.min.css')
    end

    it 'supports custom version' do
      tag = uploadcare_stylesheet_tag(version: 'v2')

      expect(tag).to include('@uploadcare/file-uploader@v2/web')
    end

    it 'supports non-minified version' do
      tag = uploadcare_stylesheet_tag(min: false)

      expect(tag).to include('uc-file-uploader-regular.css')
      expect(tag).not_to include('.min.css')
    end
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::ActionView::UploadcareIncludeTags, type: :helper
end
