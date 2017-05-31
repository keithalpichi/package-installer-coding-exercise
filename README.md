# Pluralsight Coding Exercise

## Prompt
Create a package installer that can handle dependencies. You want to be able to give the installer a list of packages with dependencies, and have it install the packages in order such that an install won’t fail due to a missing dependency.

The program should accept an array of strings defining dependencies. Each string contains the name of a package followed by a colon and space, then any dependencies required by that package. For simplicity we’ll assume a package can have at most one dependency.

The program should output a comma separated list of package names in the order of install, such that a package’s dependency will always precede that package.

## Development
Run `yarn install` to install dependencies

## Tests
Run `yarn run test`
