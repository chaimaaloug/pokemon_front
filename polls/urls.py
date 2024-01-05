# myproject/urls.py
from django.contrib import admin
from django.urls import path  # Make sure to import 'include'

urlpatterns = [
    path('admin/', admin.site.urls),
]
