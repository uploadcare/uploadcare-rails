require 'spec_helper'

describe Uploadcare::Rails do
  before :each do
    @file = Rails.application.config.uploadcare.uploader.upload_file(
      File.expand_path('../view.png', __FILE__)
    )
  end

  it 'should store api object at app.config.uploadcare.api' do
    Rails.application.config.uploadcare.api.should be_an_instance_of(Uploadcare::Api)
  end

  it 'should store uploader object at app.config.uploadcare.uploader' do
    Rails.application.config.uploadcare.uploader.should be_an_instance_of(Uploadcare::Uploader)
  end

  it 'should be configurable' do
    settings = Uploadcare::Rails::Settings.new
    keys = settings.get_client_settings.keys
    keys.each do |key|
      settings.send("#{key}=", 'test')
    end

    Rails.application.config.uploadcare.configure_api
    keys.each do |key|
      settings.api.options[key].should == 'test'
    end
  end

  it 'should add uploadcare support by is_uploadcare_file method' do
    @resume = Resume.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: @file
    )
    @resume.attachment.should be_an_instance_of(Uploadcare::Rails::File)
  end

  it 'should return nil for invalid or non-existent filed' do
    @resume = Resume.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: nil
    )
    @resume.attachment.should be_nil
  end

  it 'should cache file data' do
    @resume = Resume.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: @file
    )
    @resume.attachment
    @resume.instance_variable_get("@attachment_cached").should_not be_nil
  end

  it 'should store file after create if :autostore option is true' do
    resume = Resume.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: @file
    )
    resume.attachment.api.datetime_stored.should_not be_nil

    class ResumeNew < ActiveRecord::Base
      self.table_name = 'resumes'
      attr_accessible :attachment, :description, :name
      is_uploadcare_file :attachment, autostore: false
    end

    @file_new = Rails.application.config.uploadcare.uploader.upload_file(
      File.expand_path('../view.png', __FILE__)
    )
    resume = ResumeNew.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: @file_new
    )

    resume.attachment.api.last_keep_claim.should be_nil
  end
end
