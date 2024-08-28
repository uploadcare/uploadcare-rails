# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/mongoid/mount_uploadcare_file'

describe Uploadcare::Rails::Mongoid::MountUploadcareFile do
  before do
    allow(Rails).to receive(:cache).and_return(double(read: nil, write: nil))
    allow(Uploadcare::Rails).to receive(:configuration).and_return(
      double(
        store_files_async: false,
        delete_files_async: false,
        do_not_store: false,
        delete_files_after_destroy: false,
        cache_files: false,
        cache_namespace: 'uploadcare'
      )
    )

    stub_const 'TestModel', Class.new
    TestModel.class_eval do
      include Mongoid::Document
      include Uploadcare::Rails::Mongoid::MountUploadcareFile
      extend ActiveModel::Callbacks

      field :cdn_url, type: String

      define_model_callbacks :save, only: :after

      mount_uploadcare_file :cdn_url
    end
  end

  let(:cdn_url) { 'https://ucarecdn.com/bec49a46-7a5b-453c-836e-acc894e50c83/5e6ab92e26d54c7292757fe62537905b1.jpg' }
  let(:model) { TestModel.new(cdn_url: cdn_url) }
  let(:subject) { model.build_uploadcare_file(:cdn_url) }

  describe '#build_uploadcare_file' do
    context 'when cdn_url is empty' do
      it 'should return nil' do
        model.cdn_url = ''
        expect(subject).to be_nil
      end
    end

    context 'when cdn_url is not empty' do
      it 'should build Uploadcare::Rails::File object' do
        expect(subject).to be_an_instance_of(Uploadcare::Rails::File)
      end

      it 'should set cdn_url attribute' do
        expect(subject.cdn_url).to eq(cdn_url)
      end

      it 'should set uuid attribute' do
        expect(subject.uuid).to eq('bec49a46-7a5b-453c-836e-acc894e50c83')
      end
    end
  end

  describe '.mount_uploadcare_file' do
    it 'should define uploadcare_store_cdn_url! method' do
      expect(model).to respond_to(:uploadcare_store_cdn_url!)
    end

    it 'should define uploadcare_delete_cdn_url! method' do
      expect(model).to respond_to(:uploadcare_delete_cdn_url!)
    end

    context 'when store_files_async configuration is true' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)
      end

      it 'should enqueue StoreFileJob when calling uploadcare_store_cdn_url!' do
        expect(Uploadcare::Rails::StoreFileJob).to receive(:perform_later).with('bec49a46-7a5b-453c-836e-acc894e50c83')
        model.uploadcare_store_cdn_url!
      end
    end

    context 'when store_files_async configuration is false' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(false)
      end

      it 'should call Uploadcare::FileApi.store_file when calling uploadcare_store_cdn_url!' do
        expect(Uploadcare::FileApi).to receive(:store_file).with('bec49a46-7a5b-453c-836e-acc894e50c83')
        model.uploadcare_store_cdn_url!
      end
    end

    context 'when delete_files_async configuration is true' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:delete_files_async).and_return(true)
      end

      it 'should enqueue DeleteFileJob when calling uploadcare_delete_cdn_url!' do
        expect(Uploadcare::Rails::DeleteFileJob).to receive(:perform_later).with('bec49a46-7a5b-453c-836e-acc894e50c83')
        model.uploadcare_delete_cdn_url!
      end
    end

    context 'when delete_files_async configuration is false' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:delete_files_async).and_return(false)
      end

      it 'should call Uploadcare::FileApi.delete_file when calling uploadcare_delete_cdn_url!' do
        expect(Uploadcare::FileApi).to receive(:delete_file).with('bec49a46-7a5b-453c-836e-acc894e50c83')
        model.uploadcare_delete_cdn_url!
      end
    end

    context 'when do_not_store configuration is false' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:do_not_store).and_return(false)
      end

      it 'should set callback for saving to call uploadcare_store_cdn_url! if cdn_url attribute changed' do
        expect(TestModel).to receive(:set_callback).with(:save, :after, :uploadcare_store_cdn_url!,
                                                         if: :cdn_url_changed?)
        TestModel.mount_uploadcare_file(:cdn_url)
      end
    end

    context 'when delete_files_after_destroy configuration is true' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:delete_files_after_destroy).and_return(true)
      end

      it 'should set callback for destroying to call uploadcare_delete_cdn_url!' do
        expect(TestModel).to receive(:set_callback).with(:save, :after, :uploadcare_store_cdn_url!,
                                                         if: :cdn_url_changed?)
        expect(TestModel).to receive(:set_callback).with(:destroy, :after, :uploadcare_delete_cdn_url!)
        TestModel.mount_uploadcare_file(:cdn_url)
      end
    end
  end
end
