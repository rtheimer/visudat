from django.urls import path
from .views import RegisterUser

app_name = "accounts"

urlpatterns = [path("", RegisterUser.as_view(), name="register")]
