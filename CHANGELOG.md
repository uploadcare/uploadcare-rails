# Change Log
All notable changes to this project will be documented in this file.

## [1.2.0] - FIXME
- Gem now reports us your `uploadcare-rails` and `rails` versions using the User-Agent header (overridable via config)
- `uploadcare-ruby` gem version bumped to 1.2.x

## [1.2.0-alpha] - 2018-04-18
- Allow gem in rails 5.2
- Update default widget version to 3.x
- Remove tests against Ruby 2.0 and 2.1 that [had reached their EOL](https://www.ruby-lang.org/en/downloads/branches/)

## [1.1.1] - 2017-11-07
- Fix uploadcare config generator
- Fix issues preventing the gem to be used with rails 5.1

## [1.1.0] - 2016-07-12
### Added
- Removed widget from the asset pipeline. It is expected to use helper or to append to the asset pipeline mannualy.
- Operations for image_tag helpers.

### Fixed
- Bug with creating object with empty file or file_group.
- Workaround to remove unnecessery API cals for groups of images.

### Devepopment
- Tests have been refactored, VCR appended to development environment.
- Tests perfomance improvements.
