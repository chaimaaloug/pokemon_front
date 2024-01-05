# myproject/urls.py
from django.contrib import admin
from django.urls import path  # Make sure to import 'include'
from .views import prediction

urlpatterns = [
    path('admin/', admin.site.urls),
    path('prediction/', prediction, name='prediction'),
]
