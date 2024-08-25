from django.views.generic.edit import FormView
from .forms import VisudatAuthenticationForm


# Create your views here.


class LoginView(FormView):
    template_name = "landing/login.html"
    form_class = VisudatAuthenticationForm
    success_url = "dash"

    def form_valid(self, form):
        username = form.cleaned_data.get
