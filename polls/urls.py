# myproject/urls.py
from django.urls import path
from .views import prediction
from .views import home

urlpatterns = [
    path('', home, name='home'),
    path('prediction/', prediction, name='prediction'),
]
