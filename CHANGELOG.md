# Change Log
All notable changes to this project will be documented in this file.

## [1.1.1] - 2017-11-05
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
