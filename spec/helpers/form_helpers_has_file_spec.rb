require "spec_helper"

def should_have_expected_selector(args, expected)
  expect(form.uploadcare_field(:file, args)).
    to have_selector(:input, expected)
end

describe Uploadcare::Rails::ActionView::FormBuilder, type: :helper do
  let(:post) { Post.new }
  let(:form) { ActionView::Helpers::FormBuilder.new(:post, post, helper, {}) }

  it { expect(form.uploadcare_field(:file)).to be_a(String) }

  it 'includes uploader tag for name' do
    args = {}
    expected = {type: 'hidden', 'data-multiple' => 'false'}

    should_have_expected_selector(args, expected)
  end

  it 'should override uploadcare- attribute' do
    args = { uploadcare: { multiple: true } }
    expected = { type: 'hidden', 'data-multiple' => 'false' }

    should_have_expected_selector(args, expected)
  end

  it 'should override data- attribute' do
    args = { data: { multiple: true} }
    expected = { type: 'hidden', 'data-multiple' => 'false' }

    should_have_expected_selector(args, expected)
  end

  it 'should override data- and uploadcare- attributes' do
    args = { data: { multiple: true }, uploadcare: { multiple: true } }
    expected = { type: 'hidden', 'data-multiple' => 'false' }

    should_have_expected_selector(args, expected)
  end
end
