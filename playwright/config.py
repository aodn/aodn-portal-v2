import os

from dynaconf import Dynaconf  # type: ignore

# Lazy loaded settings object
settings = Dynaconf(
    envvar_prefix='AODN',  # variables exported as `AODN_FOO=bar` becomes `settings.FOO == 'bar'`
    settings_files=[
        'settings.toml',  # settings file
    ],
    environments=True,  # Enable layered environments (sections on settings.toml file for development, production, etc.)
)

# Reset Base URL if it is provided as an env variable
if os.getenv('BASE_URL'):
    settings.baseURL = os.getenv('BASE_URL')
