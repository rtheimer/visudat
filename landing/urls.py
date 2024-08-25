from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import LoginView

urlpatterns = [
    path("", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
