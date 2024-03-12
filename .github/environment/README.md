Github Deployment Environments
Github deployment environments are used to define unique settings for each environment i.e. staging and production

The build and push workflows need to know which AWS account to push updated docker images to.

DotEnv Files
The .env files in this directory are here as a record of the "variables" and their values.

The variables can be updated from these files using the following command:

gh variable set -R aodn/<repo name> -e <environment name> -f <environment>.env
