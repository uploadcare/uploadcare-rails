# Changelog
All notable changes to this project will be documented in this file.

The format is based now on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

* Update gem description
* Respect data-multiple in helper options (https://github.com/uploadcare/uploadcare-rails/issues/119)

## 3.3.0 — 2023-03-16

Guarantee support of maintainable versions of Ruby and Rails

### Breaking Сhanges

Drop support of unmaintainable Ruby 2.4, 2.5, 2.6 and Rails before 6.0

### Added

Add support of Ruby 3.1 and 3.2 and Rails 7.0

## 3.0.0 — 2022-12-29

This version supports latest Uploadcare REST API — [v0.7](https://uploadcare.com/api-refs/rest-api/v0.7.0/), which introduces new file management features:
* [File metadata](https://uploadcare.com/docs/file-metadata/)
* New [add-ons API](https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/Add-Ons):
  * [Background removal](https://uploadcare.com/docs/remove-bg/)
  * [Virus checking](https://uploadcare.com/docs/security/malware-protection/)
  * [Object recognition](https://uploadcare.com/docs/intelligence/object-recognition/)

### Breaking Сhanges

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
