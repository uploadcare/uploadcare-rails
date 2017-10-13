require "spec_helper"

describe "Uploadcare::Rails::Formtastic", type: :helper  do
  before :each  do
    @post = Post.new
    @form = Formtastic::FormBuilder.new(:post, @post, helper, {})
  end

  it 'should create smart uploader field' do
    tag = @form.input :file, as: :uploadcare_uploader
    expect(tag).to have_selector('input[role="uploadcare-uploader"]', visible: :all)
  end

  it 'should create single uploader field' do
    tag = @form.input :file, as: :uploadcare_single_uploader
    expect(tag)
      .to have_selector('input[role="uploadcare-uploader"][data-multiple="false"]', visible: :all)
  end

  it 'should create multiple uploader field' do
    tag = @form.input :file, as: :uploadcare_multiple_uploader
    expect(tag)
      .to have_selector('input[role="uploadcare-uploader"][data-multiple="true"]', visible: :all)
  end
end
