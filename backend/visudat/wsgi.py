"""
WSGI config for visudat project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from .env_handler import (
    env_loads,
)  # Import the function for loading environment variables
from django.core.wsgi import get_wsgi_application

# Load environment variables from the .env file
env_loads(".env")

# Check if environment variables were successfully loaded
if env_loads(".env"):
    # Set the default Django settings module
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "visudat.settings")

    # Get the WSGI application
    application = get_wsgi_application()

else:
    # Raise an error if no environment variables were found
    raise RuntimeError(
        "No environment variables found. Ensure your .env file is configured."
    )
