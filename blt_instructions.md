# Initializing a project with BLT.

## Overview
The instruction is referenced from the official Acquia [documentation](https://docs.acquia.com/acquia-cms/add-ons/blt/install/adding-to-project).

BLT is better to use in combination with tools like DDEV or Lando. 

## Requirements
- Composer managed Drupal project
- DDEV, Lando or similar tool for running project locally.

## BLT installation
1. Go to the project root. 
2. Execute:
`composer require acquia/blt:^13`
3. Review all new and modified files and commit them to Git. BLT places new files in your project directory.
`git add blt/ composer.*`
4. Run BLT commands by using `vendor/bin/blt`.

## Configure BLT for the project
More complete configuration could be found in: `vendor/acquia/blt/config/build.yml`.
Or in Acquia BLT [documentation](https://docs.acquia.com/acquia-cms/add-ons/blt), you will have to dig there well to find needed information.

Here is a general configuration that could be in use:
`blt/blt.yml` example with commented explanations:
```yaml
project:
  machine_name: fews_news_blt

# Path to the Drupal webroot.
docroot: ${repo.root}/web

git:
  # Git hooks:
  # The value of a hook should be the file path to a directory containing an
  # executable file named after the hook. Changing a hook value to 'false' will disable it.
  # You should execute `blt blt:init:git-hooks` after modifying these values.
  hooks:
    pre-commit: ${blt.root}/scripts/git-hooks
    pre-push: ${blt.root}/scripts/git-hooks
    commit-msg: ${blt.root}/scripts/git-hooks
  commit-msg:
    # Commit messages must conform to this pattern.
    pattern: "/([^ ].{15,}\\.)|(Merge branch (.)+)/"
    # Human-readable help description explaining the pattern/restrictions.
    help_description: "The commit message should include your project prefix,
                      followed by a hyphen and ticket number, followed by a colon and a space,
                      fifteen characters or more describing the commit, and end with a period."
    # Provide an example of a valid commit message.
    example: "Update module configuration."
  user:
    # Name and email to use for the purposes of Git commits if you don't want to
    # use global Git configuration.
    name: 'Drupal CI/CD'
    email: 'drupal-ci-cd@deploy.test'
  # Git remote for project artifacts deploying after executing the `blt artifact:deploy` command.
  remotes:
    # Remote for Pantheon
    - ssh://codeserver.dev.<site_ID>>@codeserver.dev.<site_ID>.drush.in:2222/~/repository.git
    # Remote for Acquia
    - <project_name>@svn-<id>.prod.hosting.acquia.com:<project_name>.git

command-hooks:
  # Executed when front end dependencies should be installed.
  frontend-reqs:
    # E.g., ${docroot}/themes/custom/mytheme
    dir: ${docroot}/themes/custom/fewsnews_theme/
    # E.g., '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 4.4.4 && npm install'
    command: npm install
  # Executed when front end assets should be generated.
  frontend-assets:
    # E.g., ${docroot}/themes/custom/mytheme
    dir: ${docroot}/themes/custom/fewsnews_theme/
    # E.g., '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 4.4.4 && npm build'
    command: npm run build

deploy:
  # Directory name that uses to store artifacts after executing the `blt artifact:build` command.
  dir: deploy
  docroot: '${deploy.dir}/web'
  # Path to file with exclude files for deployment. 
  exclude_file: ${repo.root}/blt/deploy-exclude.txt
```

## Continuous Deployment
BLT is quite useful tool for automatic code deployment.

### Requirements for CD script
- Project hosted on a cloud provider such as Acquia, Pantheon etc.
- Environment with PHP and Composer.
- Node.js with Yarn or NPM.
- Configured SSH connection.
- CLI tool of cloud provider: (`terminus` for Pantheon, `acli` for Acquia, etc.)

For the CD script, I used GitHub Actions, but if you are using something like Bitbucket Pipelines or Gitlab CI it will suit too.

The script that performs auto-deployment should contain PHP with Composer to run BLT.
If the project builds theme the environment should have Node.js as well.
Also, it should have SSH configuration to connect to cloud platforms git remote.
And CLI tool of a cloud provider to execute drush commands for the final Drupal site installation if such is required.

You can familiarize with the CD script in the root folder on the path `.github/workflows/deployment_blt.yml`.

### Pantheon deployment features

1. Add the `build_step: false` string in the `pantheon.yml` file, to prevent Pantheon from `composer install` executing.
This is not needed as this action performs by BLT. More over, it breaks the website deployment inside Pantheon.
Because `composer install` executes with error inside the directory with ready to deploy artifacts.

2. Commit the `<webroot>/sites/default/settings.pantheon.php` file to the project.
For some reason Pantheon doesn't contain this file. And it isn't added by BLT to the Pantheon that caused errors while
executing `drush` commands.

## Continuous Integrations

### PHPCS

PHPCS for BLT configures via `phpcs.xml` file, but can't be configured directly from command flags.  

`blt validate:phpcs`

### PHPUnit

1. Install the additional BLT plugin that contains extra tests:

    `composer require acquia/blt-drupal-test --with-all-dependencies`

2. Add to the `blt.yml` configuration paths for PHPUnit tests executing:

    ```yaml
    tests:
      phpunit:
        # Paths for tests executing.
        - path: '${repo.root}/web/modules'
          config: ${docroot}/core/phpunit.xml.dist
          directory: '${repo.root}/web/modules'
    
    ```

3. Execute tests with the following command:

    `blt tests:phpunit:run`
