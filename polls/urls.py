# myproject/urls.py
from django.urls import path
from .views import prediction

urlpatterns = [
    path('prediction/', prediction, name='prediction'),
]
