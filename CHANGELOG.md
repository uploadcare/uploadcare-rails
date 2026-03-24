# Changelog
All notable changes to this project will be documented in this file.

The format is based now on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## 5.0.0.rc1 - 2026-03-24

This is the first release candidate for the 5.0 rewrite.

See [MIGRATING_V5.md](https://github.com/uploadcare/uploadcare-rails/blob/5-0-stable/MIGRATING_V5.md) for the migration guide.

### Changed

* Re-centered the gem around `Uploadcare::Client` and `Uploadcare::Rails.client`
* Simplified the public Rails API to `has_uploadcare_file`, `has_uploadcare_files`,
  `uploadcare_file_field`, `uploadcare_files_field`, and the matching tag and FormBuilder helpers
* Renamed mounted wrapper objects to `Uploadcare::Rails::AttachedFile` and
  `Uploadcare::Rails::AttachedFiles`
* Rewrote the README and migration documentation to describe the actual rewrite surface
  instead of the old wrapper-based API

### Removed

* `mount_uploadcare_file`
* `mount_uploadcare_file_group`
* `uploadcare_uploader_field`
* `uploadcare_uploader_field_tag`
* `f.uploadcare_file`
* `Uploadcare::Rails::File`
* `Uploadcare::Rails::Group`
* low-level uploader composition helpers from the documented public API
* stale migration guides that described the pre-rewrite compatibility surface

## 4.0.0

This is a major release that replaces the legacy jQuery-based widget with the new
[File Uploader](https://uploadcare.com/docs/file-uploader/) built on Web Components.

### Breaking Changes

* **Minimum Ruby version raised to 3.3+**
* **Minimum Rails version raised to 7.2+**
* Replaced legacy jQuery widget with the new File Uploader (Web Components based)
* `uploadcare_include_tag` now loads File Uploader CSS and JS instead of the jQuery widget bundle.
  The `bundle:` parameter is removed; use `solution:` instead (`"regular"`, `"inline"`, `"minimal"`)
* `uploadcare_uploader_field` and `uploadcare_uploader_field_tag` now render Web Components
  (`<uc-form-input>`, `<uc-config>`, `<uc-file-uploader-*>`, `<uc-upload-ctx-provider>`)
  instead of hidden `<input>` elements. Method signatures now use keyword arguments
* Auto-detection of `multiple` from `mount_uploadcare_file_group` is preserved but can now
  be overridden by passing `multiple:` explicitly
* Module `Uploadcare::Rails::ActionView::UploadcareWidgetTags` renamed to
  `Uploadcare::Rails::ActionView::UploadcareIncludeTags`
* Configuration options renamed to match File Uploader API:
  `images_only` -> `img_only`, `tabs` -> `source_list`, `input_accept_types` -> `accept`,
  `preferred_types` -> `external_sources_preferred_types`, `multipart_min_size` -> `multipart_min_file_size`,
  `preview_proxy` -> `secure_delivery_proxy`, `cdn_base` -> `cdn_cname`,
  `camera_mirror_default` -> `camera_mirror`, `crop` -> `crop_preset`
* `do_not_store` is still used for server-side model callbacks (`mount_uploadcare_file*`).
  File Uploader `store` is a separate client-side setting and is not a drop-in replacement
* Removed widget-specific configuration options with no File Uploader equivalent:
  `live`, `manual_start`, `preview_step`, `clearable`, `system_dialog`,
  `audio_bits_per_second`, `video_preferred_mime_types`, `video_bits_per_second`,
  `locale_translations`, `locale_pluralize`
* Legacy widget parameters (`WIDGET_PARAMS`) are retained in Configuration for backward compatibility
  but are marked deprecated and no longer affect the new File Uploader

### Added

* File Uploader integration using Web Components (`<uc-config>`, `<uc-file-uploader-*>`,
  `<uc-upload-ctx-provider>`, `<uc-form-input>`)
* `uploadcare_stylesheet_tag` helper for including only File Uploader CSS
* `uploadcare_uploader` helper for rendering the uploader without a form input
* `uploadcare_config_tag` helper for rendering a `<uc-config>` element
* `uploadcare_uploader_tag` helper for rendering a `<uc-file-uploader-*>` element
* `uploadcare_ctx_provider_tag` helper for rendering a `<uc-upload-ctx-provider>` element
* `uploadcare_form_input_tag` helper for rendering a `<uc-form-input>` element
* FormBuilder integration: `f.uploadcare_file` for use with `form_with` / `form_for`
* Importmap generator: `rails g uploadcare_importmap` for Rails 7+ importmap setup
* Importmap mode for `uploadcare_include_tag` (`importmap: true` loads only CSS)
* Per-component configuration via `<uc-config>` with global defaults from initializer
* Rails 8.0 and 8.1 support
* `FILE_UPLOADER_PARAMS` configuration constants for the new File Uploader options

### Changed

* Widget script CDN changed from `ucarecdn.com` to `cdn.jsdelivr.net` (for File Uploader assets)
* Configuration now uses `uploader_config_attributes` (returns Hash for Web Component attributes)
  instead of `uploader_parameters` (returned JS global variable assignments)
* Generated config template (`rails g uploadcare_config`) updated with new File Uploader options
* `store_files_async` and `delete_files_async` default to `false` in generated config template

### Deprecated

* `Uploadcare::Rails::Configuration#uploader_parameters` — use `uploader_config_attributes` instead
* `Uploadcare::Rails::Configuration#widget` — use `uploader_config_attributes` instead
* Legacy `WIDGET_PARAMS` configuration parameters — use `FILE_UPLOADER_PARAMS` equivalents instead

## 3.4.4 — 2024-11-07

### Added

* Add mongoid support for `mount_uploadcare_file` and `mount_uploadcare_file_group` methods.

### Breaking Changes

* Drop support for Rails 6.1x in line with the currently supported Rails versions: https://rubyonrails.org/maintenance

## 3.4.3 — 2024-06-01

### Added

* For `Uploadcare::ConversionApi` added `get_document_conversion_formats_info` method to get the possible document conversion formats.

## 3.4.2 — 2024-05-11

### Added

* Added API support for `AWS Rekognition Moderation` Add-On.

## 3.4.1 — 2024-03-24

### Fixed

* Fixed invalid group id error when >= 10 files are uploaded when using `mount_uploadcare_file_group`.

## 3.4.0 — 2024-03-05

### Fixed

* Documentation issue with `uploadcare_include_tag`

### Breaking Changes

* Drop support for Ruby < 3.x
* Drop support for Rails < 6.1x

## 3.3.4 — 2023-04-04

### Changed

* Skipped network requests when the file attribute was unchanged (fixed https://github.com/uploadcare/uploadcare-rails/issues/127)

## 3.3.3 — 2023-03-27

### Changed

* Improved readme to look better at ruby-doc

## 3.3.2.1 — 2023-03-26

### Changed

* Updated links in the gemspec

## 3.3.2 — 2023-03-26

### Changed

* Fixed an issue with the configuration
* Updated the gem documentation

## 3.3.1 — 2023-03-20

### Changed

* Updated gem description
* Respect data-multiple in helper options (https://github.com/uploadcare/uploadcare-rails/issues/119)

## 3.3.0 — 2023-03-16

Guarantee support of maintainable versions of Ruby and Rails.

### Breaking Changes

Drop support of unmaintainable Ruby 2.4, 2.5, 2.6 and Rails before 6.0.

### Added

Add support of Ruby 3.1 and 3.2 and Rails 7.0.

## 3.0.0 — 2022-12-29

This version supports latest Uploadcare REST API — [v0.7](https://uploadcare.com/api-refs/rest-api/v0.7.0/), which introduces new file management features:
* [File metadata](https://uploadcare.com/docs/file-metadata/)
* New [add-ons API](https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/Add-Ons):
  * [Background removal](https://uploadcare.com/docs/remove-bg/)
  * [Virus checking](https://uploadcare.com/docs/security/malware-protection/)
  * [Object recognition](https://uploadcare.com/docs/intelligence/object-recognition/)

### Breaking Changes

- For `Uploadcare::FileApi#get_file`
  - File information doesn't return `image_info` and `video_info` fields anymore
  - Removed `rekognition_info` in favor of `appdata`
  - Parameter `add_fields` was renamed to `include`
- For `Uploadcare::FileApi#get_files`
  - Removed the option of sorting the file list by file size
- For `Uploadcare::GroupApi#store_group`
  - Changed response format
- For `Uploadcare::FileApi`
  - Removed method `copy_file` in favor of `local_copy_file` and `remote_copy_file` methods

### Changed

- For `Uploadcare::FileApi#get_file`
  - Field `content_info` that includes mime-type, image (dimensions, format, etc), video information (duration, format, bitrate, etc), audio information, etc
  - Field `metadata` that includes arbitrary metadata associated with a file
  - Field `appdata` that includes dictionary of application names and data associated with these applications

### Added

- Add Uploadcare API interface:
  - `Uploadcare::FileMetadataApi`
  - `Uploadcare::AddonsApi`
- Added an option to delete a Group
- For `Uploadcare::FileApi` add `local_copy_file` and `remote_copy_file` methods

## 2.1.1 2022-05-13
### Fix

Fixed Rails 4 tests by enforcing https.

## 2.1.0 2021-11-16
### Added

- Option `signing_secret` in the `Uploadcare::WebhookApi`.

## 2.0.0 - 2021-10-11
### :heavy_exclamation_mark: *Note: the gem uploadcare-rails 2.x is not backward compatible with 1.x.*

### Added

- Add Uploadcare API interface:
  - Uploadcare::FileApi
  - Uploadcare::UploadApi
  - Uploadcare::GroupApi
  - Uploadcare::ConversionApi
  - Uploadcare::ProjectApi
  - Uploadcare::WebhookApi
- Add uploadcare_widget_tag helper for views
- Add methods File#store, File#delete, File#load
- Add methods Group#transform_file_urls, Group#store, Group#load

### Changed

- Change File Uploader widget view helpers
- Rename has_uploadcare_file -> mount_uploadcare_file
- Rename has_uploadcare_group -> mount_uploadcare_file_group
- Change generated config path from config/uploadcare.yml to config/initializers/uploadcare.rb and add more options
- Rename the class `Uploadcare::Rails::Settings` to `Uploadcare::Rails::Configuration`
- Rename the class `Uploadcare::Rails::Operations` to `Uploadcare::Rails::Transformations::ImageTransformations`.
Configuration object is available as `Uploadcare::Rails.configuration` now
- Change methods File#url -> File#transform_url
- Change methods Group#urls -> Group#file_urls
- Change methods Group#load_data -> Group#load

### Removed

- Remove uploadcare_uploader_tag helper
- Remove uploadcare_multiple_uploader_field helper
- Remove uploadcare_single_uploader_field helper
- Remove uploadcare_uploader_options (now options are included in uploadcare_widget_tag)
- Remove FormBuilder support
- Remove Formtastic support
- Remove SimpleForm support
- Remove caching files and groups on delete
- Remove callback ```ruby after_save after_save "store_#{ attribute }".to_sym```. Now managed by the `do_not_store` option in `config/initializers/uploadcare.rb`
- Remove methods File#prepared_operations, File#to_builder, File#to_json, File#as_json, File#marshal_dump, File#image
- Remove methods Group#cache_data, Group#to_json, Group#as_json, Group#map_files, Group#load_data!, Group#marshal_dump

## 1.2.1 - 2018-10-01
### Fixed
- Allow to use multiple files or groups

## 1.2.0 - 2018-06-03

## 1.2.0-alpha3 - 2018-05-29
### Fixed

- Require `uploadcare/rails/version` in `lib/uploadcare-rails.rb`

## 1.2.0-alpha2 - 2018-05-28 - YANKED
### Changed
- Gem now reports us your `uploadcare-rails` and `rails` versions using the User-Agent header (overridable via config)
- `uploadcare-ruby` gem version bumped to 1.2.x


## 1.2.0-alpha - 2018-04-18
### Changed
- Allow gem in rails 5.2
- Update default widget version to 3.x

### Removed
- Tests against Ruby 2.0 and 2.1 that [had reached their EOL](https://www.ruby-lang.org/en/downloads/branches/)


## 1.1.1 - 2017-11-07
### Fixed
- Uploadcare config generator
- Issues preventing the gem to be used with rails 5.1


## 1.1.0 - 2016-07-12
### Added
- Removed widget from the asset pipeline. It is expected to use helper or to append to the asset pipeline manually.
- Operations for image_tag helpers.

### Fixed
- Bug with creating object with empty file or file_group.
- Workaround to remove unnecessary API-calls for groups of images.

### Development
- Tests have been refactored, VCR appended to development environment.
- Tests performance improvements.
