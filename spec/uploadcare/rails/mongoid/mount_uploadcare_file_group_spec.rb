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
        store_files_after_save: false,
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

      has_uploadcare_files :cdn_url
    end
  end

  let(:cdn_url) { 'https://api.uploadcare.com/groups/e6c3fb25-0653-454c-9c8e-7e91902bb044~2/' }
  let(:model) { TestModel.new(cdn_url: cdn_url) }
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
      it 'returns a Group object' do
        expect(subject).to be_a(Uploadcare::Rails::Group)
      end

      it 'sets correct attributes' do
        expect(subject.cdn_url).to eq(cdn_url)
        expect(subject.id).to eq(group_id)
        expect(subject.files_count.to_i).to eq(2)
      end
    end
  end

  describe '.has_uploadcare_files_for_cdn_url?' do
    it 'returns true' do
      expect(TestModel.has_uploadcare_files_for_cdn_url?).to be(true)
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

      it 'stores via client.groups.find' do
        groups_accessor = double
        client = double(groups: groups_accessor)
        allow(Uploadcare::Rails).to receive(:client).and_return(client)
        expect(groups_accessor).to receive(:find).with(group_id: group_id)
        model.uploadcare_store_cdn_url!
      end
    end

    context 'when store_files_async is true' do
      before do
        allow(Uploadcare::Rails.configuration).to receive(:store_files_async).and_return(true)
      end

      it 'enqueues StoreGroupJob' do
        expect(Uploadcare::Rails::StoreGroupJob).to receive(:perform_later).with(group_id, {})
        model.uploadcare_store_cdn_url!
      end
    end
  end

  describe 'mount_uploadcare_file_group alias' do
    it 'works as an alias' do
      expect(TestModel.method(:mount_uploadcare_file_group)).to eq(TestModel.method(:has_uploadcare_files))
    end
  end
end
