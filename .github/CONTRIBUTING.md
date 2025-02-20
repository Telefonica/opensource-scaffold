# How to contribute

Thank you for being part of the {{ company }} Open Source Community!

## Table of Contents

- [Getting started](#getting-started)
- [Test the action locally](#test-the-action-locally)
- [Branching model](#branching-model)
- [Versioning](#versioning)
- [Pull Request](#pull-request)
- [Release process](#release-process)
- [License](#license)
  - [Licensing of new files](#licensing-of-new-files)
  - [Public Domain](#public-domain)
- [Code of Conduct](#code-of-conduct)
- [Contributor License Agreement](#contributor-license-agreement)

## Getting started

This repository contains two elements:

* A NPM package for creating or checking the scaffold resources
   * The code is in the `src` directory
   * The binary for the CLI is in the `bin` directory, and it imports the built code from the `dist` directory
* A Github action for checking the scaffold resources
   * The code is in the `action` directory, and it imports the code from the `src` directory

Here you'll find the instructions for contributing to both.

1. :hammer_and_wrench: Install the dependencies

   ```bash
   pnpm install
   ```

2. :building_construction: Package both the NPM package and the Github action

   ```bash
   pnpm build
   ```

3. :white_check_mark: Run the unit tests both for the NPM package and the Github action

   ```bash
   $ pnpm test
   ...

## Test the action locally

The [`@github/local-action`](https://github.com/github/local-action) utility
can be used to test your action locally. It is a simple command-line tool
that "stubs" (or simulates) the GitHub Actions Toolkit. This way, you can run
your TypeScript action locally without having to commit and push your changes
to a repository.

The `local-action` utility can be run in the following ways:

- Visual Studio Code Debugger

   Make sure to review and, if needed, update
   [`.vscode/launch.json`](./.vscode/launch.json)

- Terminal/Command Prompt

   ```bash
   # npx local action <action-yaml-path> <entrypoint> <dotenv-file>
   npx local-action . src/main.ts .env
   ```

You can provide a `.env` file to the `local-action` CLI to set environment
variables used by the GitHub Actions Toolkit. For more information, see the example
file, [`.env.example`](./.env.example), and the
[GitHub Actions Documentation](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables).

## Branching model

In short, we have a "main" branch and a "release" branch. The "main" branch must always reflect the latest stable published version of the packages in the repository. The "release" branch is used to prepare the release of features without having to promote any unpublished changes to the "main" branch. It is the default branch for PRs.

Some important points to consider:

* __The "main" branch must always reflect the latest stable published version of the packages in the repository__.
* We have a "release" branch for the following reasons:
   * To enable the maintainer to prepare the release of features without having to promote any unpublished changes to the "main" branch. By preparing the release we mainly mean to decide how to group changes in different releases.
   * It is long-lived because we also have bots that will open PRs. So, they can be configured to open PRs to the "release" branch, and their changes will also enter in the process of preparing the release, such as changes from any other contributor.
* __The "release" branch is the default branch for PRs.__ Only a project maintainer should open a PR to the "main" branch, and only when the release is ready to be published.
* Usually, feature branches should be short-lived, and they should be merged into the "release" branch as soon as possible. This way, the changes will be included in the next release, and the feature branch can be deleted.
* When necessary, a medium-lived branch can be created from the "release" branch to group changes that will be released together and require more time to be prepared. Once the changes are ready, the branch can be merged into the "release" branch.

> [!IMPORTANT]
> The action code must be always packaged before pushing changes to the repository. This is because the action code is executed in the GitHub Actions environment, and it must be in the JavaScript format. The action code is packaged using the `pnpm build` command. A github action check is executed on every PR to verify if the action code was packaged before pushing changes to the repository.

### Merging strategy

We use the __squash and merge strategy for merging PRs to the release branch__. This means that all the changes in the PR will be squashed into a single commit before being merged. The reasons are:

* To keep the history clean in the release branch
* To make easier to understand the changes in each release.

But we use the __merge commit strategy for merging PRs to the main branch from the release branch__. The reasons are:

* To keep in the history the information about the features that were merged separately into the release branch. This is very important, because we may have changes from different packages in the release branch. Squashing all the changes into a single commit would make it difficult to understand or revert the changes for a specific package.
* To avoid having to rebase the release branch every time a PR is merged to the main branch.

## Versioning

This project uses [Semantic Versioning](https://semver.org/). The version number is defined in the `package.json` file. The version number must be updated in the `package.json` file before creating a new release.

> [!WARNING]
> The action version in the `templates/workflows/opensource-checks.yml` file must be always updated before creating a new release to the latest major version.

## Pull Request

When you're finished with the changes, create a __pull request to the `release` branch__.

* Fill the PR template. This template helps reviewers understand your changes as well as the purpose of your pull request.
* Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) if you are solving one.
* Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge. Once you submit your PR, a maintainer will review your proposal. We may ask questions or request additional information.
* We may ask for changes to be made before a PR can be merged, either using suggested changes or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
* As you update your PR and apply changes, mark each conversation as resolved.
* If you run into any merge issues, checkout this git tutorial to help you resolve merge conflicts and other issues.

## Release process

Once the PR is approved and __merged into the release branch__, a project maintainer can start the release process by:

1. Updating the version number in the `package.json` file.
2. Updating the action version in the `templates/.github/workflows/opensource-checks.yml` file when it is a major release.
3. Updating the CHANGELOG.md file with the changes in the new version.
4. Tagging the main branch with the corresponding version numbers.

   This project includes a helper script, [`script/release`](./script/release)
   designed to streamline the process of tagging and pushing new releases for
   GitHub Actions.

   GitHub Actions allows users to select a specific version of the action to use,
   based on release tags. This script simplifies this process by performing the
   following steps:

   1. **Retrieving the latest release tag:** The script starts by fetching the most
      recent SemVer release tag of the current branch, by looking at the local data
      available in your repository.
   1. **Prompting for a new release tag:** The user is then prompted to enter a new
      release tag. To assist with this, the script displays the tag retrieved in
      the previous step, and validates the format of the inputted tag (vX.X.X). The
      user is also reminded to update the version field in package.json.
   1. **Tagging the new release:** The script then tags a new release and syncs the
      separate major tag (e.g. v1, v2) with the new release tag (e.g. v1.0.0,
      v2.1.2). When the user is creating a new major release, the script
      auto-detects this and creates a `releases/v#` branch for the previous major
      version.
   1. **Pushing changes to remote:** Finally, the script pushes the necessary
      commits, tags and branches to the remote repository. From here, you will need
      to create a new release in GitHub so users can easily reference the new tags
      in their workflows.

5. Create a release in GitHub with the tag created in the previous step. __This will trigger the workflow to publish the new version of the NPM package.__
6. Merge the release branch into the main branch by opening a PR.


## License

By contributing to this project, you agree that your contributions will be licensed under the [LICENSE](../LICENSE) file in the root of this repository, and that you agree to the [Contributor License Agreement](#contributor-license-agreement).

### Licensing of new files

This project adheres to the [Software Package Data Exchange (SPDX)](https://spdx.dev/). SPDX is a standard format for communicating the components, licenses, and copyrights associated with software packages. It is a simple and concise way to communicate licensing information. Read more about how to define headers using the SPDX ids [here](https://spdx.dev/learn/handling-license-info/).

This license must be used for all new code, unless the containing project, module or externally-imported codebase uses a different license. If you can't put a header in the file due to its structure, please put it in a LICENSE file in the same directory.

```
// SPDX-FileCopyrightText: Telefónica Innovación Digital
// SPDX-License-Identifier: MPL-2.0

# SPDX-FileCopyrightText: Telefónica Innovación Digital
# SPDX-License-Identifier: MPL-2.0

<!--
   SPDX-FileCopyrightText: Telefónica Innovación Digital
   SPDX-License-Identifier: MPL-2.0
-->

SPDX-FileCopyrightText: Telefónica Innovación Digital
SPDX-License-Identifier: MPL-2.0
```

### MIT License

This license can be used for test scripts and other short code snippets, at the discretion of the author.

```
// SPDX-FileCopyrightText: Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

# SPDX-FileCopyrightText: Telefónica Innovación Digital
# SPDX-License-Identifier: MIT

<!--
   SPDX-FileCopyrightText: Telefónica Innovación Digital
   SPDX-License-Identifier: MIT
-->

SPDX-FileCopyrightText: Telefónica Innovación Digital
SPDX-License-Identifier: MIT
```

## Code of Conduct

Please read our [Code of Conduct](../.github/CODE_OF_CONDUCT.md) before contributing.

## Contributor License Agreement

This is a human-readable summary of (and not a substitute for) the [full agreement](./CLA.md). This highlights only some of the key terms of the CLA. It has no legal value and you should carefully review all the terms of the [actual CLA before agreeing](./CLA.md).

* __Grant of copyright license__. You give {{ company }} permission to use your copyrighted work in commercial products.
* __Grant of patent license__. If your contributed work uses a patent, you give {{ company }} a license to use that patent including within commercial products. You also agree that you have permission to grant this license.
* __No Warranty or Support Obligations__. By making a contribution, you are not obligating yourself to provide support for the contribution, and you are not taking on any warranty obligations or providing any assurances about how it will perform.

The [CLA](./CLA.md) does not change the terms of the underlying license used by our software such as the Business Source License, Mozilla Public License, or MIT License. You are still free to use our projects within your own projects or businesses, republish modified source code, and more subject to the terms of the project license. Please reference the appropriate license for the project you're contributing to to learn more.
