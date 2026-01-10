# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/action_view/uploadcare_uploader_tags'

RSpec.describe Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper do
  let(:public_key) { 'demopublickey' }
  let(:config_attributes) { { pubkey: public_key } }

  before do
    allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
      .and_return(config_attributes)
    # Use a fixed UUID for predictable test output
    allow(SecureRandom).to receive(:uuid).and_return('test-uuid-1234')
  end

  # ============================================================================
  # Tag Helper: uploadcare_uploader_field_tag
  # This helper does NOT perform error wrapping (like text_field_tag)
  # ============================================================================
  describe '#uploadcare_uploader_field_tag' do
    it 'generates a uc-form-input element with name attribute' do
      tag = uploadcare_uploader_field_tag(:file)

      expect(tag).to include('<uc-form-input')
      expect(tag).to include('name="file"')
      expect(tag).to include('ctx-name="test-uuid-1234"')
    end

    it 'supports bracket notation in name' do
      tag = uploadcare_uploader_field_tag('user[avatar]')

      expect(tag).to include('name="user[avatar]"')
    end

    it 'generates a uc-config element' do
      tag = uploadcare_uploader_field_tag(:file)

      expect(tag).to include('<uc-config')
      expect(tag).to include('ctx-name="test-uuid-1234"')
    end

    it 'generates a uc-file-uploader-regular element by default' do
      tag = uploadcare_uploader_field_tag(:file)

      expect(tag).to include('<uc-file-uploader-regular')
      expect(tag).to include('ctx-name="test-uuid-1234"')
    end

    it 'generates a uc-upload-ctx-provider element' do
      tag = uploadcare_uploader_field_tag(:file)

      expect(tag).to include('<uc-upload-ctx-provider')
      expect(tag).to include('ctx-name="test-uuid-1234"')
    end

    it 'uses custom ctx_name when provided' do
      tag = uploadcare_uploader_field_tag(:file, ctx_name: 'my-uploader')

      expect(tag).to include('ctx-name="my-uploader"')
      expect(tag).not_to include('ctx-name="test-uuid-1234"')
    end

    context 'with different solution types' do
      %w[regular inline minimal].each do |solution|
        it "generates uc-file-uploader-#{solution} component" do
          tag = uploadcare_uploader_field_tag(:file, solution: solution)

          expect(tag).to include("<uc-file-uploader-#{solution}")
        end
      end
    end

    it 'passes additional options to config' do
      tag = uploadcare_uploader_field_tag(:file, multiple: true, img_only: true)

      expect(tag).to include('multiple="true"')
      expect(tag).to include('img-only="true"')
    end
  end

  # ============================================================================
  # Standalone Helper: uploadcare_uploader_field
  # This helper retrieves the model and performs error wrapping (like text_field)
  # ============================================================================
  describe '#uploadcare_uploader_field' do
    # Create a mock model class with errors support
    let(:model_class) do
      Struct.new(:avatar, :errors) do
        def initialize(avatar: nil, errors: nil)
          super(avatar, errors || MockErrors.new)
        end
      end
    end

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

    # Make MockErrors available for the model_class
    before do
      stub_const('MockErrors', mock_errors_class)
    end

    it 'generates all uploader components' do
      @post = model_class.new

      tag = uploadcare_uploader_field(:post, :avatar)

      expect(tag).to include('<uc-form-input')
      expect(tag).to include('<uc-config')
      expect(tag).to include('<uc-file-uploader-regular')
      expect(tag).to include('<uc-upload-ctx-provider')
    end

    it 'sets name attribute on uc-form-input with object_name[method_name] format' do
      @post = model_class.new

      tag = uploadcare_uploader_field(:post, :avatar)

      expect(tag).to include('<uc-form-input')
      expect(tag).to include('name="post[avatar]"')
    end

    it 'uses custom ctx_name when provided' do
      @post = model_class.new

      tag = uploadcare_uploader_field(:post, :avatar, ctx_name: 'custom-uploader')

      expect(tag).to include('ctx-name="custom-uploader"')
    end

    context 'with different solution types' do
      %w[regular inline minimal].each do |solution|
        it "generates uc-file-uploader-#{solution} component" do
          @post = model_class.new

          tag = uploadcare_uploader_field(:post, :avatar, solution: solution)

          expect(tag).to include("<uc-file-uploader-#{solution}")
        end
      end
    end

    context 'when object has no errors' do
      it 'does not wrap the field with error markup' do
        @post = model_class.new(errors: mock_errors_class.new({}))

        tag = uploadcare_uploader_field(:post, :avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end

    context 'when object has validation errors on the field' do
      it 'wraps the field with field_error_proc' do
        @post = model_class.new(errors: mock_errors_class.new(avatar: [ "can't be blank" ]))

        tag = uploadcare_uploader_field(:post, :avatar)

        expect(tag).to include('field_with_errors')
        expect(tag).to include('<uc-form-input')
      end
    end

    context 'when object has errors on a different field' do
      it 'does not wrap the field with error markup' do
        @post = model_class.new(errors: mock_errors_class.new(title: [ "can't be blank" ]))

        tag = uploadcare_uploader_field(:post, :avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end

    context 'when object is not set (nil)' do
      it 'does not wrap the field with error markup' do
        @post = nil

        tag = uploadcare_uploader_field(:post, :avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end

    context 'when object does not respond to errors' do
      it 'does not wrap the field with error markup' do
        @post = Object.new

        tag = uploadcare_uploader_field(:post, :avatar)

        expect(tag).not_to include('field_with_errors')
      end
    end
  end

  # ============================================================================
  # Uploader Component Helper: uploadcare_uploader
  # Generates uploader without form input (for custom JS handling)
  # ============================================================================
  describe '#uploadcare_uploader' do
    it 'generates uploader components without uc-form-input' do
      tag = uploadcare_uploader(ctx_name: 'my-uploader')

      expect(tag).not_to include('<uc-form-input')
      expect(tag).to include('<uc-config')
      expect(tag).to include('<uc-file-uploader-regular')
      expect(tag).to include('<uc-upload-ctx-provider')
    end

    it 'uses the provided ctx_name' do
      tag = uploadcare_uploader(ctx_name: 'my-uploader')

      expect(tag).to include('ctx-name="my-uploader"')
    end

    context 'with different solution types' do
      %w[regular inline minimal].each do |solution|
        it "generates uc-file-uploader-#{solution} component" do
          tag = uploadcare_uploader(ctx_name: 'my-uploader', solution: solution)

          expect(tag).to include("<uc-file-uploader-#{solution}")
        end
      end
    end

    it 'passes additional options to config' do
      tag = uploadcare_uploader(ctx_name: 'my-uploader', multiple: true)

      expect(tag).to include('multiple="true"')
    end
  end

  # ============================================================================
  # Low-level Component Helpers
  # ============================================================================
  describe '#uploadcare_config_tag' do
    it 'generates a uc-config element with ctx-name' do
      tag = uploadcare_config_tag(ctx_name: 'my-uploader')

      expect(tag).to include('<uc-config')
      expect(tag).to include('ctx-name="my-uploader"')
      expect(tag).to include('</uc-config>')
    end

    it 'includes default configuration attributes' do
      tag = uploadcare_config_tag(ctx_name: 'my-uploader')

      expect(tag).to include('pubkey="demopublickey"')
    end

    it 'allows overriding configuration options' do
      tag = uploadcare_config_tag(ctx_name: 'my-uploader', pubkey: 'custom-key')

      expect(tag).to include('pubkey="custom-key"')
    end

    it 'converts underscore attribute names to kebab-case' do
      tag = uploadcare_config_tag(ctx_name: 'my-uploader', img_only: true)

      expect(tag).to include('img-only="true"')
    end

    context 'with multiple attribute' do
      it 'renders multiple="true" when true' do
        tag = uploadcare_config_tag(ctx_name: 'my-uploader', multiple: true)

        expect(tag).to include('multiple="true"')
      end

      it 'renders multiple="false" when false' do
        tag = uploadcare_config_tag(ctx_name: 'my-uploader', multiple: false)

        expect(tag).to include('multiple="false"')
      end
    end

    context 'when overriding config defaults with underscore options' do
      # This tests that user options (snake_case) properly override config defaults (kebab-case)
      # Config stores keys like :"img-only" but users pass :img_only

      it 'allows overriding underscore options from config' do
        allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
          .and_return({ "img-only": true, pubkey: public_key })

        tag = uploadcare_config_tag(ctx_name: 'my-uploader', img_only: false)

        expect(tag).to include('img-only="false"')
        expect(tag).not_to include('img-only="true"')
        # Ensure no duplicate attributes
        expect(tag.scan('img-only=').count).to eq(1)
      end

      it 'allows overriding multiple underscore options from config' do
        allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
          .and_return({
            "img-only": true,
            "source-list": "local,camera",
            "max-local-file-size-bytes": 1000,
            pubkey: public_key
          })

        tag = uploadcare_config_tag(
          ctx_name: 'my-uploader',
          img_only: false,
          source_list: "local,url,camera",
          max_local_file_size_bytes: 5000
        )

        expect(tag).to include('img-only="false"')
        expect(tag).to include('source-list="local,url,camera"')
        expect(tag).to include('max-local-file-size-bytes="5000"')
        # Ensure no duplicate attributes
        expect(tag.scan('img-only=').count).to eq(1)
        expect(tag.scan('source-list=').count).to eq(1)
        expect(tag.scan('max-local-file-size-bytes=').count).to eq(1)
      end

      it 'preserves config defaults when not overridden' do
        allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
          .and_return({ "img-only": true, multiple: false, pubkey: public_key })

        tag = uploadcare_config_tag(ctx_name: 'my-uploader', img_only: false)

        expect(tag).to include('img-only="false"')
        expect(tag).to include('multiple="false"')
        expect(tag).to include('pubkey="demopublickey"')
      end

      it 'accepts options with string keys and properly merges them' do
        allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
          .and_return({ "img-only" => true, pubkey: public_key })

        # Users might pass string keys when building options dynamically
        options = { "img_only" => false }
        tag = uploadcare_config_tag(ctx_name: 'my-uploader', **options.transform_keys(&:to_sym))

        expect(tag).to include('img-only="false"')
        expect(tag.scan('img-only=').count).to eq(1)
      end

      it 'handles options already in kebab-case' do
        allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_config_attributes)
          .and_return({ "img-only": true, pubkey: public_key })

        # Users might also pass kebab-case directly (though less common in Ruby)
        tag = uploadcare_config_tag(ctx_name: 'my-uploader', "img-only": false)

        expect(tag).to include('img-only="false"')
        expect(tag.scan('img-only=').count).to eq(1)
      end
    end
  end

  describe '#uploadcare_uploader_tag' do
    it 'generates a uc-file-uploader-regular element by default' do
      tag = uploadcare_uploader_tag(ctx_name: 'my-uploader')

      expect(tag).to eq('<uc-file-uploader-regular ctx-name="my-uploader"></uc-file-uploader-regular>')
    end

    it 'generates different solution variants' do
      tag = uploadcare_uploader_tag(ctx_name: 'my-uploader', solution: 'inline')

      expect(tag).to include('<uc-file-uploader-inline')
    end
  end

  describe '#uploadcare_ctx_provider_tag' do
    it 'generates a uc-upload-ctx-provider element' do
      tag = uploadcare_ctx_provider_tag(ctx_name: 'my-uploader')

      expect(tag).to eq('<uc-upload-ctx-provider ctx-name="my-uploader"></uc-upload-ctx-provider>')
    end
  end

  describe '#uploadcare_form_input_tag' do
    it 'generates a uc-form-input element with ctx-name' do
      tag = uploadcare_form_input_tag(ctx_name: 'my-uploader')

      expect(tag).to eq('<uc-form-input ctx-name="my-uploader"></uc-form-input>')
    end

    it 'includes name attribute when provided' do
      tag = uploadcare_form_input_tag(name: 'user[avatar]', ctx_name: 'my-uploader')

      expect(tag).to include('name="user[avatar]"')
      expect(tag).to include('ctx-name="my-uploader"')
    end

    it 'omits name attribute when not provided' do
      tag = uploadcare_form_input_tag(ctx_name: 'my-uploader')

      expect(tag).not_to match(/\sname=/)
    end
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::ActionView::UploadcareUploaderTags, type: :helper
end
