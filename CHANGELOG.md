# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

#### Added
#### Changed
#### Fixed
#### Deprecated
#### Removed

## [1.2.0] - 2025-03-24

### Added

* feat: Add `ignore` input to the github action, enabling to ignore some files when checking the scaffold resources.

### Changed

* chore: Upgrade `check-license-compliance` to v3.0.0-beta.3 (Support more granularity for including or excluding modules)

## [1.1.1] - 2025-02-20

### Fixed

* chore: Change copyright headers. Remove "and contributors" from files where it is not applicable for the moment

### Changed

* chore: Upgrade `check-license-compliance` to v3.0.0-beta.2 (change copyright headers)

## [1.1.0] - 2025-02-13

### Added

* feat: Upgrade `check-license-compliance` to v3. Now it supports checking licenses from NPM, Maven, Python and Go dependencies. Update the action configuration accordingly
* feat: Generate different `check-license-compliance` configurations based on the license type
* feat: Add `check-license-compliance` options commented out to configuration file, so it is easier to understand what can be configured

### Changed

* chore: Bump `check-spdx-headers` action to version v1

### Fixed

* fix: Fix typo in "0BSD" license

## [1.0.1] - 2025-01-21

### Changed

* test: Ensure 100% action tests coverage

### Fixed

* fix: Do not console error in case of invalid check when "exitOverride" is set to true
* docs: Add missing change to v1.0.0 CHANGELOG entry

## [1.0.0] - 2025-01-21

### Added

* test: Add unit tests

### Changed

* chore: Upgrade `check-spdx-headers` and `check-license-compliance` actions to v1

### Fixed

* fix: Throw error if Copyright holder is not provided and prompts are disabled

## [0.2.2] - 2025-01-14

### Fixed

* fix: Fix MIT license template data. Year and copyright holder name were not being replaced correctly.
* fix: Fix renovate user id in the CLA allowlist

## [0.2.1] - 2025-01-13

### Fixed

* fix: Use the copyright's holder name in the contributing template licensing examples
* docs: Add missing CHANGELOG.md file to the documentation
* fix: Fix renovate user id in the CLA allowlist

## [0.2.0] - 2025-01-13

### Added

* feat: Generate CHANGELOG.md file
* feat: Allow renovate and dependabot to skip CLA by default
* docs: Add step in the template process about signing the CLA
* docs: Add note about installing the dependencies in the "open-source-checks" workflow

### Changed

* feat: Change "opensource" word to "open source" everywhere

### Fixed

* chore: Replace {{repo_url}} with the actual repository URL in the repository GitHub templates

## [0.1.1] - 2025-01

### Added

* feat: First beta version
