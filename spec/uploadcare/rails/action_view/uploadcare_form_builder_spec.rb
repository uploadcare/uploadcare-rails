# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/action_view/uploadcare_uploader_tags'
require 'uploadcare/rails/action_view/uploadcare_form_builder'

RSpec.describe 'ActionView::Helpers::FormBuilder#uploadcare_file', type: :helper do
  let(:public_key) { 'demopublickey' }
  let(:config_attributes) { { pubkey: public_key } }

  # Mock errors class
  let(:mock_errors_class) do
    Class.new do
      def initialize(errors = {})
        @errors = errors
      end

      def [](key)
        @errors[key] || []
      end
    end
  end

  # Mock model class
  let(:model_class) do
    errors_class = mock_errors_class
    Struct.new(:avatar, :errors, keyword_init: true) do
      define_method(:initialize) do |avatar: nil, errors: nil|
        super(avatar: avatar, errors: errors || errors_class.new)
      end
    end
  end

  before do
    allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
      .and_return(config_attributes)
    # Use a fixed UUID for predictable test output
    allow(SecureRandom).to receive(:uuid).and_return('test-uuid-1234')
  end

  # Helper to create a FormBuilder instance
  def form_builder_for(object, object_name: nil)
    object_name ||= object.class.name.underscore rescue 'object'
    ActionView::Helpers::FormBuilder.new(object_name, object, self, {})
  end

  describe '#uploadcare_file' do
    it 'generates all uploader components' do
      user = model_class.new
      builder = form_builder_for(user, object_name: 'user')

      tag = builder.uploadcare_file(:avatar)

      expect(tag).to include('<uc-form-input')
      expect(tag).to include('<uc-config')
      expect(tag).to include('<uc-file-uploader-regular')
      expect(tag).to include('<uc-upload-ctx-provider')
    end

    it 'sets name attribute on uc-form-input with object_name[method] format' do
      user = model_class.new
      builder = form_builder_for(user, object_name: 'user')

      tag = builder.uploadcare_file(:avatar)

      expect(tag).to include('name="user[avatar]"')
    end

    it 'uses auto-generated ctx_name by default' do
      user = model_class.new
      builder = form_builder_for(user, object_name: 'user')

      tag = builder.uploadcare_file(:avatar)

      expect(tag).to include('ctx-name="test-uuid-1234"')
    end

    it 'uses custom ctx_name when provided' do
      user = model_class.new
      builder = form_builder_for(user, object_name: 'user')

      tag = builder.uploadcare_file(:avatar, ctx_name: 'custom-uploader')

      expect(tag).to include('ctx-name="custom-uploader"')
    end

    context 'with different solution types' do
      %w[regular inline minimal].each do |solution|
        it "generates uc-file-uploader-#{solution} component" do
          user = model_class.new
          builder = form_builder_for(user, object_name: 'user')

          tag = builder.uploadcare_file(:avatar, solution: solution)

          expect(tag).to include("<uc-file-uploader-#{solution}")
        end
      end
    end

    it 'passes additional options to config' do
      user = model_class.new
      builder = form_builder_for(user, object_name: 'user')

      tag = builder.uploadcare_file(:avatar, multiple: true, img_only: true)

      expect(tag).to include('multiple="true"')
      expect(tag).to include('img-only="true"')
    end

    context 'when object has no errors' do
      it 'does not wrap the field with error markup' do
        user = model_class.new(errors: mock_errors_class.new({}))
        builder = form_builder_for(user, object_name: 'user')

        tag = builder.uploadcare_file(:avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end

    context 'when object has validation errors on the field' do
      it 'wraps the field with field_error_proc' do
        user = model_class.new(errors: mock_errors_class.new(avatar: [ "can't be blank" ]))
        builder = form_builder_for(user, object_name: 'user')

        tag = builder.uploadcare_file(:avatar)

        expect(tag).to include('field_with_errors')
        expect(tag).to include('<uc-form-input')
      end

      it 'includes all uploader components inside the error wrapper' do
        user = model_class.new(errors: mock_errors_class.new(avatar: [ "can't be blank" ]))
        builder = form_builder_for(user, object_name: 'user')

        tag = builder.uploadcare_file(:avatar)

        # The entire output should be wrapped
        expect(tag).to start_with('<div class="field_with_errors">')
        expect(tag).to include('<uc-config')
        expect(tag).to include('<uc-file-uploader-regular')
      end
    end

    context 'when object has errors on a different field' do
      it 'does not wrap the field with error markup' do
        user = model_class.new(errors: mock_errors_class.new(email: [ 'is invalid' ]))
        builder = form_builder_for(user, object_name: 'user')

        tag = builder.uploadcare_file(:avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end

    context 'when object is nil' do
      it 'does not wrap the field with error markup' do
        builder = ActionView::Helpers::FormBuilder.new('user', nil, self, {})

        tag = builder.uploadcare_file(:avatar)

        expect(tag).not_to include('field_with_errors')
      end

      it 'still generates uploader components' do
        builder = ActionView::Helpers::FormBuilder.new('user', nil, self, {})

        tag = builder.uploadcare_file(:avatar)

        expect(tag).to include('<uc-form-input')
        expect(tag).to include('<uc-file-uploader-regular')
      end
    end

    context 'when object does not respond to errors' do
      it 'does not wrap the field with error markup' do
        plain_object = Object.new
        builder = form_builder_for(plain_object, object_name: 'item')

        tag = builder.uploadcare_file(:avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end
  end

  describe 'custom field_error_proc' do
    around do |example|
      original_proc = ActionView::Base.field_error_proc
      example.run
      ActionView::Base.field_error_proc = original_proc
    end

    it 'uses custom field_error_proc when configured' do
      ActionView::Base.field_error_proc = proc do |html_tag, _instance|
        "<span class=\"custom-error\">#{html_tag}</span>".html_safe
      end

      user = model_class.new(errors: mock_errors_class.new(avatar: [ "can't be blank" ]))
      builder = form_builder_for(user, object_name: 'user')

      tag = builder.uploadcare_file(:avatar)

      expect(tag).to include('<span class="custom-error">')
      expect(tag).not_to include('field_with_errors')
    end
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper
  c.include ActionView::Helpers::FormHelper, type: :helper
end
