from django.conf import django
from django.contrib.auth import re
from .forms import CustomUserCreationForm
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin


class RegisterUser(LoginRequiredMixin, FormView):
    login_url = "/"
    redirect_field_name = "next"
    template_name = "accounts/register.html"
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("accounts:register")

    def form_valid(self, form):
        form.save()
        # Add a success message
        messages.success(self.request, "Registration successful!")
        return super().form_valid(form)

    def form_invalid(self, form):
        # When the form is invalid, it will automatically pass the form with errors
        return self.render_to_response(self.get_context_data(form=form))
