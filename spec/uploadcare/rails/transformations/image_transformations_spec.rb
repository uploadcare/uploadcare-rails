# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/transformations/image_transformations'

describe Uploadcare::Rails::Transformations::ImageTransformations do
  subject { described_class.new(**arguments).call }

  let(:arguments) do
    {
      # Resize and crop
      preview: '300x500',
      resize: '300x500',
      smart_resize: '300x500',
      crop: {
        dimensions: '300x500',
        coords: '2400,700',
        alignment: 'center'
      },
      scale_crop: {
        dimensions: '300x500',
        offsets: '50%,50%',
        smart_mode: 'smart'
      },
      setfill: 'ece3d2',
      # Compression
      format: 'png',
      quality: 'smart',
      progressive: 'yes',
      gif2video: true,
      # Colors
      brightness: '50',
      exposure: '50',
      gamma: '50',
      contrast: '50',
      saturation: '50',
      vibrance: '50',
      warmth: '50',
      enhance: '50',
      grayscale: true,
      invert: true,
      filter: {
        name: 'adaris',
        amount: 50
      },
      srgb: 'fast',
      max_icc_size: 2,
      # Blur and sharpen
      blur: {
        strength: 50,
        amount: 90
      },
      blur_region: {
        dimensions: '300x500',
        coords: '2400,700',
        strength: 50
      },
      sharp: 50,
      # Overlay
      overlay: {
        uuid: 'self',
        relative_dimensions: '50%x50%',
        relative_coordinates: 'center',
        opacity: '20p'
      },
      # Rotate and flip
      autorotate: 'yes',
      rotate: 90,
      flip: true,
      mirror: true
    }
  end
  let(:expected_string) do
    "/preview/#{arguments[:preview]}/-" \
      "/resize/#{arguments[:resize]}/-" \
      "/smart_resize/#{arguments[:smart_resize]}/-" \
      "/crop/#{arguments[:crop].values.join('/')}/-" \
      "/scale_crop/#{arguments[:scale_crop].values.join('/')}/-" \
      "/setfill/#{arguments[:setfill]}/-" \
      "/format/#{arguments[:format]}/-" \
      "/quality/#{arguments[:quality]}/-" \
      "/progressive/#{arguments[:progressive]}/-" \
      '/gif2video/-' \
      "/brightness/#{arguments[:brightness]}/-" \
      "/exposure/#{arguments[:exposure]}/-" \
      "/gamma/#{arguments[:gamma]}/-" \
      "/contrast/#{arguments[:contrast]}/-" \
      "/saturation/#{arguments[:saturation]}/-" \
      "/vibrance/#{arguments[:vibrance]}/-" \
      "/warmth/#{arguments[:warmth]}/-" \
      "/enhance/#{arguments[:enhance]}/-" \
      '/grayscale/-' \
      '/invert/-' \
      "/filter/#{arguments[:filter].values.join('/')}/-" \
      "/srgb/#{arguments[:srgb]}/-" \
      "/max_icc_size/#{arguments[:max_icc_size]}/-" \
      "/blur/#{arguments[:blur].values.join('/')}/-" \
      "/blur_region/#{arguments[:blur_region].values.join('/')}/-" \
      "/sharp/#{arguments[:sharp]}/-" \
      "/overlay/#{arguments[:overlay].values.join('/')}/-" \
      "/autorotate/#{arguments[:autorotate]}/-" \
      "/rotate/#{arguments[:rotate]}/-" \
      '/flip/-' \
      '/mirror/'
  end

  it 'builds image transformations params url' do
    expect(subject).to eq expected_string
  end

  context 'when sending invalid data' do
    context 'and when including spaces in params' do
      let(:arguments) { { preview: '300x 500' } }

      it 'removes all spaces from the result string' do
        expect(subject).not_to match(/\s/)
      end
    end
  end
end
