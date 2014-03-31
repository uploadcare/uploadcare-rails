require "spec_helper"

describe Uploadcare::Rails::SimpleForm, type: :helper  do
  before(:each) do
    @post = Post.new
    @form = SimpleForm::FormBuilder.new(:post, @post, helper, {}, nil)
  end

  it 'should create smart uploader field' do
    tag = @form.input :file, as: :uploadcare_uploader
    tag.should have_selector("input", :role => "uploadcare-uploader")
  end

  it 'should create single uploader field' do
    tag = @form.input :file, as: :uploadcare_uploader
    tag.should have_selector("input", :role => "uploadcare-uploader")
  end

  it 'should create multiple uploader field' do
    tag = @form.input :file, as: :uploadcare_uploader
    tag.should have_selector("input", :role => "uploadcare-uploader")
  end
end