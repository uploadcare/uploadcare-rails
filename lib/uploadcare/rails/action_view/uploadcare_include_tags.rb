# frozen_string_literal: true

require "action_view"
require "uploadcare/rails/configuration"

module Uploadcare
  module Rails
    module ActionView
      # A module containing view helpers for including the Uploadcare File Uploader assets (CSS/JS)
      module UploadcareIncludeTags
        CDN_HOST = "cdn.jsdelivr.net"
        FILE_UPLOADER_PATH = "/npm/@uploadcare/file-uploader@v1/web"
        SOLUTIONS = %w[regular inline minimal].freeze
        VERSION_FORMAT = /\Av\d+(?:\.\d+)*\z/.freeze

        # A view helper to include the Uploadcare File Uploader JS and CSS from CDN.
        # See https://uploadcare.com/docs/file-uploader/ for more info.
        #
        # Example (CDN mode - default):
        #   <%= uploadcare_include_tag %>
        #   => <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.css">
        #      <script type="module">
        #        import * as UC from 'https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/file-uploader.min.js';
        #        UC.defineComponents(UC);
        #      </script>
        #
        # Example (importmap mode - for Rails 7+ with importmaps):
        #   <%= uploadcare_include_tag(importmap: true) %>
        #   => <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.css">
        #   (JS is loaded via importmap, so only CSS is included)
        #
        # Arguments:
        #   version: (String, default: 'v1') - version of the File Uploader
        #   solution: (String, default: 'regular') - File Uploader solution type
        #     valid options: 'regular', 'inline', 'minimal'
        #   min: (true/false, default: true) - sets which version to get, minified or not
        #   importmap: (true/false, default: false) - if true, only includes CSS (JS loaded via importmap)

        def uploadcare_include_tag(version: "v1", solution: "regular", min: true, importmap: false)
          version = validate_uploader_version!(version)
          solution = validate_uploader_solution!(solution)
          min_suffix = min ? ".min" : ""
          base_path = FILE_UPLOADER_PATH.sub("@v1", "@#{version}")

          css_path = "#{base_path}/uc-file-uploader-#{solution}#{min_suffix}.css"
          css_uri = URI::HTTPS.build(host: CDN_HOST, path: css_path)
          css_tag = stylesheet_link_tag(css_uri.to_s)

          # In importmap mode, JS is loaded via importmap configuration
          # so we only need to include the CSS
          return css_tag if importmap

          js_path = "#{base_path}/file-uploader#{min_suffix}.js"
          js_uri = URI::HTTPS.build(host: CDN_HOST, path: js_path)
          js_tag = javascript_tag(<<~JS, type: "module")
            import * as UC from '#{js_uri}';
            UC.defineComponents(UC);
          JS

          safe_join([ css_tag, js_tag ])
        end

        # A view helper to include only the Uploadcare File Uploader CSS.
        # Useful when using importmaps or custom JS setup.
        #
        # Example:
        #   <%= uploadcare_stylesheet_tag %>
        #   => <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.css">
        #
        # Arguments:
        #   version: (String, default: 'v1') - version of the File Uploader
        #   solution: (String, default: 'regular') - File Uploader solution type
        #   min: (true/false, default: true) - sets which version to get, minified or not

        def uploadcare_stylesheet_tag(version: "v1", solution: "regular", min: true)
          version = validate_uploader_version!(version)
          solution = validate_uploader_solution!(solution)
          min_suffix = min ? ".min" : ""
          base_path = FILE_UPLOADER_PATH.sub("@v1", "@#{version}")
          css_path = "#{base_path}/uc-file-uploader-#{solution}#{min_suffix}.css"
          css_uri = URI::HTTPS.build(host: CDN_HOST, path: css_path)

          stylesheet_link_tag(css_uri.to_s)
        end

        private

        def validate_uploader_solution!(solution)
          value = solution.to_s
          return value if SOLUTIONS.include?(value)

          raise ArgumentError, "Unsupported Uploadcare uploader solution: #{solution.inspect}"
        end

        def validate_uploader_version!(version)
          value = version.to_s
          return value if VERSION_FORMAT.match?(value)

          raise ArgumentError, "Unsupported Uploadcare uploader version: #{version.inspect}"
        end
      end
    end
  end
end
