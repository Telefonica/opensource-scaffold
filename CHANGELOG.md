# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

#### Added
#### Changed
#### Fixed
#### Deprecated
#### Removed

## [unreleased]

### Added

* feat: Generate different `check-license-compliance` configurations based on the license type

### Changed

* chore: Upgrade `check-spdx-headers` action to version 1.x
* chore: Upgrade `check-license-compliance` action to version 1.x

## [1.0.0] - 2025-01-21

### Added

* test: Add unit tests

### Changed

* chore: Upgrade `check-spdx-headers` and `check-license-compliance` actions to v1

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
