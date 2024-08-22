from django import forms
from django.contrib.auth.forms import AuthenticationForm


class VisudatAuthenticationForm(AuthenticationForm):

    username = forms.CharField(label="Benutzer", widget=forms.TextInput(attrs={}))
    password = forms.CharField(label="Passwort", widget=forms.TextInput(attrs={}))
