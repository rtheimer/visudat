from django.views.generic.edit import FormView
from .forms import VisudatAuthenticationForm


# Create your views here.


class Index(FormView):
    template_name = "landing/index.html"
    form_class = VisudatAuthenticationForm
    success_url = ""

    def form_valid(self, form):
        return super().form_valid(form)
