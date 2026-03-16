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
        store_files_after_save: false,
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
      it 'builds Uploadcare::Rails::File object' do
        expect(subject).to be_an_instance_of(Uploadcare::Rails::File)
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
        expect(files_accessor).to receive(:batch_store).with(uuids: ['bec49a46-7a5b-453c-836e-acc894e50c83'])
        model.uploadcare_store_cdn_url!
      end
    end

    context 'when store_files_async is true' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)
      end

      it 'enqueues StoreFileJob' do
        expect(Uploadcare::Rails::StoreFileJob).to receive(:perform_later).with('bec49a46-7a5b-453c-836e-acc894e50c83', {})
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
        expect(files_accessor).to receive(:batch_delete).with(uuids: ['bec49a46-7a5b-453c-836e-acc894e50c83'])
        model.uploadcare_delete_cdn_url!
      end
    end
  end

  describe 'mount_uploadcare_file alias' do
    it 'works as an alias' do
      expect(TestModel.method(:mount_uploadcare_file)).to eq(TestModel.method(:has_uploadcare_file))
    end
  end
end
