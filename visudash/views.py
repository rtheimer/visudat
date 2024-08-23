from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm


def dashboard(request):
    return HttpResponse("VISUDAT Dashboard")
