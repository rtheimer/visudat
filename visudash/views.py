from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect


class DashboardView(LoginRequiredMixin, TemplateView):
    login_url = "/"
    redirect_field_name = "next"
    template_name = "dashboard/dashboard.html"

    def form_valid(self, form):
        # Get username and password from the form
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")

        # Authenticate the user
        user = authenticate(self.request, username=username, password=password)
        print(username)

        if user is not None:
            # If user is authenticated, log them in
            login(self.request, user)
            return redirect(self.get_success_url())  # Redirect to the success URL
