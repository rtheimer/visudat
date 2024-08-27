"""
URL configuration for visudat project.

"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("dash/", include("visudash.urls")),
    path("", include("landing.urls")),
    path("accounts/", include("accounts.urls")),
    # path("accounts/", include("django.contrib.auth.urls")),
]
