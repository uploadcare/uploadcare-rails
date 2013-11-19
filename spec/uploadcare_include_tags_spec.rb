require 'spec_helper'

describe ActionView::Helpers do
  # include ActionView::Helpers
  it "should include widget from cdn" do
    tag = helper.include_uploadcare_widget_from_cdn
    # tag = include_uploadcare_widget_from_cdn
    binding.pry
  end
end