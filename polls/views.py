from django.shortcuts import render
from django.http import HttpResponse

def prediction(request):
    result = "<h1>Prédiction pokémon</h1>"
    return HttpResponse(result)
