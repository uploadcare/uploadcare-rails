require 'spec_helper'

describe Uploadcare::Rails do
  it "should include widget from cdn" do
    tag = helper.include_uploadcare_widget_from_cdn
    tag.should be_kind_of(String)
    tag.should == ("<script src=\"https://ucarecdn.com/widget/#{UPLOADCARE_SETTINGS.widget_version}/uploadcare/uploadcare-#{UPLOADCARE_SETTINGS.widget_version}.min.js\"></script>")
  end

  it "should specify widget version" do
    version = "0.13.3"

    tag = helper.include_uploadcare_widget_from_cdn({version: version})
    tag.should == ("<script src=\"https://ucarecdn.com/widget/#{version}/uploadcare/uploadcare-#{version}.min.js\"></script>")
  end

  it "should load not minified version" do
    version = "0.13.3"
    min = false

    tag = helper.include_uploadcare_widget_from_cdn({version: version, min: min})
    tag.should == ("<script src=\"https://ucarecdn.com/widget/#{version}/uploadcare/uploadcare-#{version}.js\"></script>")
  end

  it "should return js settings" do
    settings = helper.uploadcare_settings
    settings.should be_kind_of(String)
    settings.should_not be_empty
  end

  it "should include all uplaodcare settings" do
    settings = helper.uploadcare_settings
    settings.should have_selector("script", :content => "UPLOADCARE_PUBLIC_KEY")
    settings.should have_selector("script", :content => "UPLOADCARE_LOCALE")
    settings.should have_selector("script", :content => "UPLOADCARE_PREVIEW_STEP")
    settings.should have_selector("script", :content => "UPLOADCARE_CLEARABLE")
    settings.should have_selector("script", :content => "UPLOADCARE_TABS")
    settings.should have_selector("script", :content => "UPLOADCARE_AUTOSTORE")
    settings.should have_selector("script", :content => "UPLOADCARE_MANUAL_START")
    settings.should have_selector("script", :content => "UPLOADCARE_PATH_VALUE")
  end
end