# frozen_string_literal: true

# A generator that sets up Uploadcare File Uploader for Rails importmap
class UploadcareImportmapGenerator < Rails::Generators::Base
  desc "This generator sets up Uploadcare File Uploader for use with Rails importmap"

  source_root File.expand_path("templates", __dir__)

  def add_importmap_pins
    return unless importmap_path.exist?

    append_to_file importmap_path do
      <<~RUBY

        # Uploadcare File Uploader
        pin "@uploadcare/file-uploader", to: "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/file-uploader.min.js"
        pin "uploadcare"
      RUBY
    end

    say_status :pin, "@uploadcare/file-uploader"
    say_status :pin, "uploadcare"
  end

  def create_uploadcare_initializer
    copy_file "uploadcare_js_initializer.js", "app/javascript/uploadcare.js"
  end

  def show_post_install_message
    say ""
    say "=" * 60
    say "Uploadcare File Uploader setup complete!", :green
    say "=" * 60
    say ""
    say "Next steps:"
    say ""
    say "1. Add the Uploadcare stylesheet to your layout (e.g. app/views/layouts/application.html.erb):"
    say '   <%= stylesheet_link_tag "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.css" %>', :cyan
    say ""
    say "2. Import the initializer in your application.js:"
    say '   import "uploadcare"', :cyan
    say ""
    say "3. Add an uploader field to your views:"
    say '   <%= uploadcare_file_field :post, :image %>', :cyan
    say ""
    say "4. (Optional) Customize the JavaScript in app/javascript/uploadcare.js"
    say ""
  end

  private

  def importmap_path
    Rails.root.join("config/importmap.rb")
  end
end
