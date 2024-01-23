# Session authentication
This leverages Django's session framework to authenticate users. Users are logged in and session data is stored server-side linked to that user.

### Enable sessions in Django and make sure SessionAuthentication is in the authentication classes:

```
#settings.py

    INSTALLED_APPS = [
        #...
        'django.contrib.sessions'
    ]

    MIDDLEWARE = [
        # ...
        'django.contrib.sessions.middleware.SessionMiddleware',
        # ...
    ]
   
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework.authentication.SessionAuthentication',
            # ...
        ]
    }         
```
### Add login and logout views to allow obtaining and destroying session,m keys:

```  
#views.py

from rest_framework.response import Response
from rest_framework.views import APIView

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Validate credentials
       
        # Login user
       
        return Response("User logged in")

class LogoutView(APIView):
    def post(self, request):
        # Logout user
       
        return Response("User logged out")

```
Users can now log in via the login view to obtain a session ID. This session ID should be included in a cookie for subsequent authenticated requests.

Session auth is good for web APIs that need to maintain user state. However, it requires storing session data server-side so it may not scale as well as token auth.