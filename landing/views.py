from django.views.generic.edit import FormView
from .forms import VisudatAuthenticationForm
from django.contrib.auth import authenticate, login


class LoginView(FormView):
    template_name = "landing/login.html"
    form_class = VisudatAuthenticationForm
    success_url = "dash"

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
            return super().form_valid(form)
        else:
            return self.form_invalid(form)
