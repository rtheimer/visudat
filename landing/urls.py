from django.urls import path
from django.contrib.auth.views import LoginView
from .views import Index

urlpatterns = [
    path("", Index.as_view(), name="index"),
]
