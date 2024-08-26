from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class DashboardView(LoginRequiredMixin, TemplateView):
    login_url = "/"
    redirect_field_name = "next"
    template_name = "dashboard/dashboard.html"
