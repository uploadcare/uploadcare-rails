# frozen_string_literal: true

require 'spec_helper'
require 'uploadcare/rails/action_view/uploadcare_include_tags'

describe Uploadcare::Rails::ActionView::UploadcareWidgetTags, type: :helper do
  let(:global_variables) { 'UPLOADCARE_PUBLIC_KEY = demopublickey;' }

  before do
    allow(Uploadcare::Rails).to receive_message_chain(:configuration, :uploader_parameters)
      .and_return(global_variables)
  end

  context 'when including a widget' do
    context 'and checking available bundles' do
      %w[full default api ie8 lang.en].each do |bundle|
        %w[3 3.x 2 1].each do |version|
          [true, false].each do |min|
            it "includes a widget from cdn with params: vesrion = #{version}, bundle = #{bundle} and min = #{min}" do
              tag = uploadcare_include_tag(version: version, bundle: bundle, min: min)

              expect(tag).to match(
                [
                  '<script src="https://ucarecdn.com/libs/widget/',
                  version,
                  "/uploadcare#{bundle == 'default' ? '' : ".#{bundle}"}#{min ? '.min' : ''}.js\"></script>"
                ].join
              )
            end
          end
        end
      end

      context 'and checking global variables' do
        it 'includes global variables' do
          expect(uploadcare_include_tag).to match(global_variables)
        end
      end
    end
  end
end

RSpec.configure do |c|
  c.include Uploadcare::Rails::ActionView::UploadcareWidgetTags, type: :helper
end
