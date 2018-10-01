# Changelog
All notable changes to this project will be documented in this file.

The format is based now on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
- Removed widget from the asset pipeline. It is expected to use helper or to append to the asset pipeline mannualy.
- Operations for image_tag helpers.

### Fixed
- Bug with creating object with empty file or file_group.
- Workaround to remove unnecessery API cals for groups of images.

### Devepopment
- Tests have been refactored, VCR appended to development environment.
- Tests perfomance improvements.


[Unreleased]: https://github.com/uploadcare/uploadcare-rails/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/uploadcare/uploadcare-rails/compare/v1.2.0...v1.1.1
