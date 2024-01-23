from django.urls import path
from . import views, data_views



urlpatterns = [
    path("api/data/", views.read_csv_to_json, name="api"),
    path("users/", views.UserView.as_view(), name="users"),
    path("owners/", views.Owners.as_view(), name="owner"),
    path("<int:pk>/owners/", views.Owners.as_view(), name="pk_owner"),
    path("plants/", views.Plants.as_view(), name="plant"),
    path("<int:pk>/plants/", views.Plants.as_view(), name="pk_plant"),
    path("api-logout/", views.LogoutView.as_view(), name="logout"),
    path("<int:pk>/total/", data_views.TotalData.as_view(), name="pk_logout"),
    path("<int:pk>/<int:year>/year/", data_views.AnnualData.as_view(), name="pk_logout"),
    path("<int:pk>/<int:month>/<int:year>/month/", data_views.MonthlyData.as_view(), name="pk_logout"),
    path("logger/", views.DataLoggers.as_view(), name="logger"),
    path("<int:pk>/logger/", views.DataLoggers.as_view(), name="pk_logger"),
    path("api-token-auth/", views.LoginView.as_view(), name="login"),
    path("databuses/", views.DataLoggerBuses.as_view(), name="databus"),
    path("<int:pk>/databuses/", views.DataLoggerBuses.as_view(), name="pk_databus"),
]
