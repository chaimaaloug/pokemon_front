from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html', {'title': 'Pokémon'})

def prediction(request):
    return render(request, 'prediction.html', {'title': 'Pokémon'})

