# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/internal/mongoid_hooks'

describe Uploadcare::Rails::Internal::MongoidHooks do
  before do
    allow(Rails).to receive(:cache).and_return(double(read: nil, write: nil))
    allow(Uploadcare::Rails).to receive(:configuration).and_return(
      double(
        store_files_async: false,
        delete_files_async: false,
        store_files_after_save: false,
        delete_files_after_destroy: false,
        cache_files: false,
        cache_namespace: 'uploadcare'
      )
    )
  end

  describe 'has_uploadcare_file' do
    before do
      stub_const 'TestModel', Class.new
      TestModel.class_eval do
        include Mongoid::Document
        include Uploadcare::Rails::Internal::MongoidHooks
        extend ActiveModel::Callbacks

        field :cdn_url, type: String

        define_model_callbacks :save, only: :after

        has_uploadcare_file :cdn_url
      end
    end

    let(:cdn_url) { 'https://ucarecdn.com/bec49a46-7a5b-453c-836e-acc894e50c83/5e6ab92e26d54c7292757fe62537905b1.jpg' }
    let(:model) { TestModel.new(cdn_url: cdn_url) }
    let(:subject) { model.build_uploadcare_file(:cdn_url) }

    describe '#build_uploadcare_file' do
      context 'when cdn_url is empty' do
        it 'returns nil' do
          model.cdn_url = ''
          expect(subject).to be_nil
        end
      end

      context 'when cdn_url is not empty' do
        it 'builds AttachedFile object' do
          expect(subject).to be_an_instance_of(Uploadcare::Rails::AttachedFile)
        end

        it 'sets cdn_url attribute' do
          expect(subject.cdn_url).to eq(cdn_url)
        end

        it 'sets uuid attribute' do
          expect(subject.uuid).to eq('bec49a46-7a5b-453c-836e-acc894e50c83')
        end
      end
    end

    describe '.has_uploadcare_file' do
      it 'defines uploadcare_store method' do
        expect(model).to respond_to(:uploadcare_store_cdn_url!)
      end

      it 'defines uploadcare_delete method' do
        expect(model).to respond_to(:uploadcare_delete_cdn_url!)
      end

      context 'when store_files_async is false' do
        before do
          allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(false)
        end

        it 'stores via client.files.batch_store' do
          files_accessor = double
          client = double(files: files_accessor)
          allow(Uploadcare::Rails).to receive(:client).and_return(client)
          expect(files_accessor).to receive(:batch_store).with(uuids: [ 'bec49a46-7a5b-453c-836e-acc894e50c83' ])
          model.uploadcare_store_cdn_url!
        end
      end

      context 'when store_files_async is true' do
        before do
          allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)
        end

        it 'enqueues StoreFileJob' do
          expect(Uploadcare::Rails::StoreFileJob).to receive(:perform_later).with('bec49a46-7a5b-453c-836e-acc894e50c83')
          model.uploadcare_store_cdn_url!
        end
      end

      context 'when delete_files_async is false' do
        before do
          allow(Uploadcare::Rails.configuration).to receive(:delete_files_async).and_return(false)
        end

        it 'deletes via client.files.batch_delete' do
          files_accessor = double
          client = double(files: files_accessor)
          allow(Uploadcare::Rails).to receive(:client).and_return(client)
          expect(files_accessor).to receive(:batch_delete).with(uuids: [ 'bec49a46-7a5b-453c-836e-acc894e50c83' ])
          model.uploadcare_delete_cdn_url!
        end
      end
    end
  end

  describe 'has_uploadcare_files' do
    before do
      stub_const 'TestGroupModel', Class.new
      TestGroupModel.class_eval do
        include Mongoid::Document
        include Uploadcare::Rails::Internal::MongoidHooks
        extend ActiveModel::Callbacks

        field :cdn_url, type: String

        define_model_callbacks :save, only: :after

        has_uploadcare_files :cdn_url
      end
    end

    let(:cdn_url) { 'https://ucarecdn.com/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/' }
    let(:model) { TestGroupModel.new(cdn_url: cdn_url) }
    let(:group_id) { 'e6c3fb25-0653-454c-9c8e-7e91902bb044~2' }

    describe '#build_uploadcare_file_group' do
      let(:subject) { model.build_uploadcare_file_group(:cdn_url) }

      context 'when cdn_url is empty' do
        it 'returns nil' do
          model.cdn_url = ''
          expect(subject).to be_nil
        end
      end

      context 'when cdn_url is not empty' do
        it 'returns an AttachedFiles object' do
          expect(subject).to be_a(Uploadcare::Rails::AttachedFiles)
        end

        it 'sets correct attributes' do
          expect(subject.cdn_url).to eq(cdn_url)
          expect(subject.id).to eq(group_id)
          expect(subject.files_count.to_i).to eq(2)
          expect(subject.file_urls).to eq(
            [
              'https://ucarecdn.com/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/nth/0/',
              'https://ucarecdn.com/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/nth/1/'
            ]
          )
        end
      end
    end

    describe '.has_uploadcare_files_for_cdn_url?' do
      it 'returns true' do
        expect(TestGroupModel.has_uploadcare_files_for_cdn_url?).to be(true)
      end
    end

    describe '.has_uploadcare_files' do
      it 'defines a getter method' do
        expect(model).to respond_to(:cdn_url)
      end

      it 'defines a store method' do
        expect(model).to respond_to(:uploadcare_store_cdn_url!)
      end

      context 'when store_files_async is false' do
        before do
          allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(false)
        end

        it 'fetches group and batch-stores its files' do
          group_resource = double(files: [ { 'uuid' => 'f1' }, { 'uuid' => 'f2' } ])
          groups_accessor = double
          files_accessor = double
          client = double(groups: groups_accessor, files: files_accessor)
          allow(Uploadcare::Rails).to receive(:client).and_return(client)
          allow(groups_accessor).to receive(:find).with(group_id: group_id).and_return(group_resource)
          expect(files_accessor).to receive(:batch_store).with(uuids: %w[f1 f2])
          model.uploadcare_store_cdn_url!
        end
      end

      context 'when store_files_async is true' do
        before do
          allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)
        end

        it 'enqueues StoreGroupJob' do
          expect(Uploadcare::Rails::StoreGroupJob).to receive(:perform_later).with(group_id)
          model.uploadcare_store_cdn_url!
        end
      end
    end
  end

  describe 'async callbacks with custom clients' do
    before do
      stub_const 'TenantModel', Class.new
      TenantModel.class_eval do
        include Mongoid::Document
        include Uploadcare::Rails::Internal::MongoidHooks
        extend ActiveModel::Callbacks

        field :cdn_url, type: String

        define_model_callbacks :save, only: :after

        has_uploadcare_file :cdn_url, uploadcare_client: -> {
          { public_key: 'tenant_pk', secret_key: 'tenant_sk' }
        }
      end
    end

    let(:model) do
      TenantModel.new(cdn_url: 'https://ucarecdn.com/bec49a46-7a5b-453c-836e-acc894e50c83/')
    end

    it 'raises when async store is used with a custom client' do
      allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)

      expect do
        model.uploadcare_store_cdn_url!
      end.to raise_error(ArgumentError, /custom uploadcare_client/)
    end

    it 'raises when async delete is used with a custom client' do
      allow(Uploadcare::Rails.configuration).to receive(:delete_files_async).and_return(true)

      expect do
        model.uploadcare_delete_cdn_url!
      end.to raise_error(ArgumentError, /custom uploadcare_client/)
    end
  end

  describe 'macro definition validation for async callbacks' do
    it 'raises when async store is enabled with custom uploadcare_client' do
      allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)

      expect do
        Class.new do
          include Mongoid::Document
          include Uploadcare::Rails::Internal::MongoidHooks

          field :cdn_url, type: String

          has_uploadcare_file :cdn_url, uploadcare_client: -> {
            { public_key: 'tenant_pk', secret_key: 'tenant_sk' }
          }
        end
      end.to raise_error(ArgumentError, /custom uploadcare_client/)
    end

    it 'raises when async delete is enabled with custom uploadcare_client' do
      allow(Uploadcare::Rails.configuration).to receive(:delete_files_async).and_return(true)

      expect do
        Class.new do
          include Mongoid::Document
          include Uploadcare::Rails::Internal::MongoidHooks

          field :cdn_url, type: String

          has_uploadcare_file :cdn_url, uploadcare_client: -> {
            { public_key: 'tenant_pk', secret_key: 'tenant_sk' }
          }
        end
      end.to raise_error(ArgumentError, /custom uploadcare_client/)
    end
  end

  describe 'callback registration strategy' do
    it 'prefers after_commit callbacks when available' do
      allow(Uploadcare::Rails.configuration).to receive(:store_files_after_save).and_return(true)
      allow(Uploadcare::Rails.configuration).to receive(:delete_files_after_destroy).and_return(true)

      klass = Class.new do
        include Uploadcare::Rails::Internal::MongoidHooks

        class << self
          attr_reader :after_commit_calls, :set_callback_calls

          def after_commit(*args, **kwargs)
            @after_commit_calls ||= []
            @after_commit_calls << [ args, kwargs ]
          end

          def set_callback(*args, **kwargs)
            @set_callback_calls ||= []
            @set_callback_calls << [ args, kwargs ]
          end
        end

        def read_attribute(*)
          nil
        end

        has_uploadcare_file :cdn_url
      end

      expect(klass.after_commit_calls.size).to eq(2)
      expect(klass.set_callback_calls).to be_nil
    end

    it 'registers store callback condition against changed attributes only' do
      allow(Uploadcare::Rails.configuration).to receive(:store_files_after_save).and_return(true)
      allow(Uploadcare::Rails.configuration).to receive(:delete_files_after_destroy).and_return(false)

      klass = Class.new do
        include Uploadcare::Rails::Internal::MongoidHooks

        class << self
          attr_reader :after_commit_calls

          def after_commit(*args, **kwargs)
            @after_commit_calls ||= []
            @after_commit_calls << [ args, kwargs ]
          end
        end

        def read_attribute(*)
          nil
        end

        has_uploadcare_file :cdn_url
      end

      store_callback = klass.after_commit_calls.find { |(args, _)| args.first == :uploadcare_store_cdn_url! }
      condition = store_callback.last[:if]

      changed_record = Struct.new(:previous_changes, :destroyed?) do
        def evaluate_condition(&block)
          instance_exec(&block)
        end
      end

      expect(changed_record.new({ "cdn_url" => [ "old", "new" ] }, false).evaluate_condition(&condition)).to eq(true)
      expect(changed_record.new({}, false).evaluate_condition(&condition)).to eq(false)
      expect(changed_record.new({ "cdn_url" => [ "old", "new" ] }, true).evaluate_condition(&condition)).to eq(false)
    end
  end
end
