# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/mongoid/mount_uploadcare_file_group'

describe Uploadcare::Rails::Mongoid::MountUploadcareFileGroup do
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
      include Uploadcare::Rails::Mongoid::MountUploadcareFileGroup
      extend ActiveModel::Callbacks

      field :cdn_url, type: String

      define_model_callbacks :save, only: :after

      mount_uploadcare_file_group :cdn_url
    end
  end

  let(:cdn_url) { 'https://api.uploadcare.com/groups/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/' }
  let(:model) { TestModel.new(cdn_url: cdn_url) }
  let(:files_count) { 2 }
  let(:file_attributes) { { cdn_url: cdn_url, id: group_id, files_count: files_count } }
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
      it 'returns a new Uploadcare::Rails::Group object' do
        expect(subject).to be_a(Uploadcare::Rails::Group)
      end

      it 'sets the correct attributes on the Uploadcare::Rails::Group object' do
        expect(subject.cdn_url).to eq(cdn_url)
        expect(subject.id).to eq(group_id)
        expect(subject.files_count.to_i).to eq(files_count)
      end
    end
  end

  describe 'Singleton .has_uploadcare_file_group_for_cdn_url?' do
    it 'returns true' do
      expect(TestModel.has_uploadcare_file_group_for_cdn_url?).to be(true)
    end
  end

  describe '.mount_uploadcare_file_group' do
    let(:attribute) { :cdn_url }

    it 'defines a getter method for the specified attribute' do
      expect(model).to respond_to(attribute)
    end

    it 'defines a method to store the file group asynchronously' do
      expect(model).to respond_to("uploadcare_store_#{attribute}!")
    end

    context 'when the file group is present' do
      it 'stores the file group synchronously if not configured for async storage' do
        allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(false)
        expect(Uploadcare::GroupApi).to receive(:store_group).with(group_id)
        model.send("uploadcare_store_#{attribute}!")
      end

      it 'performs the store job asynchronously if configured' do
        allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)
        expect(Uploadcare::Rails::StoreGroupJob).to receive(:perform_later).with(group_id)
        model.send("uploadcare_store_#{attribute}!")
      end
    end

    context 'when do_not_store configuration is true' do
      it 'does not define the after_save callback' do
        allow(Uploadcare::Rails.configuration).to receive(:do_not_store).and_return(true)
        expect(TestModel).not_to receive(:after_save)
        TestModel.mount_uploadcare_file_group(:attribute)
      end
    end

    context 'when do_not_store configuration is false' do
      it 'defines the after_save callback' do
        allow(Uploadcare::Rails.configuration).to receive(:do_not_store).and_return(false)
        expect(TestModel).to receive(:set_callback).with(:save, :after, :uploadcare_store_cdn_url!)
        TestModel.mount_uploadcare_file_group(attribute)
      end
    end
  end
end
