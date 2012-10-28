require 'spec_helper'

describe Uploadcare::Rails do
  before :each do
    @uploader = Uploadcare::Uploader.new
    @file = @uploader.upload_file(File.expand_path('../view.png', __FILE__))
  end

  it 'should store api object at app.config.uploadcare.api' do
    Rails.application.config.uploadcare.api.should be_an_instance_of(Uploadcare::Api)
  end

  it 'should be configurable' do
    settings = Rails.application.config.uploadcare.get_settings

    Uploadcare::Rails::Engine.configure do
      Uploadcare::Rails::Settings.keys.each do |key|
        config.uploadcare.send("#{key}=", 'test')
      end
    end
    Rails.application.config.uploadcare.make_api

    Uploadcare::Rails::Settings.keys.each do |key|
      Rails.application.config.uploadcare.api.options[key].should == 'test'
    end
    Rails.application.config.uploadcare = Uploadcare::Rails::Settings.new(settings)
    Rails.application.config.uploadcare.make_api    
  end

  it 'should add uploadcare support by is_uploadcare_file method' do
    
    @resume = Resume.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: @file
    )
    @resume.attachment.should be_an_instance_of(Uploadcare::Api::File)
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
    resume.attachment.last_keep_claim.should_not be_nil

    class ResumeNew < ActiveRecord::Base
      set_table_name :resumes
      attr_accessible :attachment, :description, :name
      is_uploadcare_file :attachment, autostore: false
    end

    resume = Resume.create!(
      description: 'description',
      name: 'Ivan Navi',
      attachment: @file
    )
    resume.attachment.last_keep_claim.should be_nil
  end
end
