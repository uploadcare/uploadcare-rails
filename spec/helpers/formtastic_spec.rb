require "spec_helper"

begin
  req = require 'formtastic'
rescue Exception => e
  req = nil
end

if req
  require 'uploadcare/rails/formtastic/formtastic'
  describe "Uploadcare::Rails::Formtastic", type: :helper  do
    before :each  do
      @post = Post.new
      @form = Formtastic::FormBuilder.new(:post, @post, helper, {})
    end

    it 'should create smart uploader field' do
      tag = @form.input :file, as: :uploadcare_uploader
      tag.should have_selector("input", :role => "uploadcare-uploader")
    end

    it 'should create single uploader field' do
      tag = @form.input :file, as: :uploadcare_single_uploader
      tag.should have_selector("input", :role => "uploadcare-uploader", "data-multiple" => "false")
    end

    it 'should create multiple uploader field' do
      tag = @form.input :file, as: :uploadcare_multiple_uploader
      tag.should have_selector("input", :role => "uploadcare-uploader", "data-multiple" => "true")
    end
  end
end
