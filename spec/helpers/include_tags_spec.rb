require 'spec_helper'

describe Uploadcare::Rails do
  it 'includes widget from cdn' do
    tag = helper.include_uploadcare_widget_from_cdn

    expect(tag).to eq(
      [
        "<script src=\"https://ucarecdn.com/libs/widget/",
        UPLOADCARE_SETTINGS.widget_version,
        '/uploadcare.min.js"></script>'
      ].join
    )
  end

  describe 'for specifyed version' do
    let(:version) { '0.13.3' }

    it 'uses widget version' do
      tag = helper.include_uploadcare_widget_from_cdn(version: version)

      expect(tag).to eq(
        "<script src=\"https://ucarecdn.com/libs/widget/#{ version }/"\
        'uploadcare.min.js"></script>'
      )
    end

    it 'loads not minified version' do
      tag =
        helper.include_uploadcare_widget_from_cdn(version: version, min: false)

      expect(tag).to eq(
        "<script src=\"https://ucarecdn.com/libs/widget/#{ version }/"\
        'uploadcare.js"></script>'
      )
    end
  end

  describe 'uploadcare settings' do
    let(:subject) { helper.uploadcare_settings }

    it { is_expected.to be_a(String) }
    it { is_expected.not_to be_empty }
    %w(
      UPLOADCARE_LOCALE UPLOADCARE_PREVIEW_STEP
      UPLOADCARE_PUBLIC_KEY UPLOADCARE_CLEARABLE
      UPLOADCARE_TABS UPLOADCARE_AUTOSTORE
      UPLOADCARE_MANUAL_START UPLOADCARE_PATH_VALUE).each do |content|
      it 'contains expected selector' do
        is_expected.to have_xpath("//script[text()[contains(.,'UPLOADCARE')]]", visible: :all)
      end
    end
  end
end
