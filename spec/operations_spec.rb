require 'spec_helper'

describe Uploadcare::Rails do
  let(:operations) do
    {
      format: :jpeg,
      quality: :normal,
      progressive: :yes,
      preview: '200x150',
      scale_crop: '100x100',
      resize: '150x',
      inline: '//overlay/:uuid/50%x50%/center/'
    }
  end

  let(:subject) { Uploadcare::Rails::Operations.new(operations).to_s }

  it { is_expected.to include('format/jpeg') }
  it { is_expected.to include('quality/normal') }
  it { is_expected.to include('progressive/yes') }
  it { is_expected.to include('preview/200x150') }
  it { is_expected.to include('scale_crop/100x100') }
  it { is_expected.to include('resize/150x') }
  it { is_expected.to include('/overlay/:uuid/50%x50%/center/') }

  it do
    is_expected.
      to eq('-/format/jpeg/-/quality/normal/-/progressive/yes/-/preview/200x150/-/scale_crop/100x100/-/resize/150x/-/overlay/:uuid/50%x50%/center/')
  end
end
