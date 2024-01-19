from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html', {'title': 'Pokémon'})

from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html', {'title': 'Pokémon'})

def prediction(request):
    result = request.GET.get('result', '')
    return render(request, 'prediction.html', {'result': result, 'prediction_url': '/prediction.html'})
