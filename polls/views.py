from django.shortcuts import render
from django.http import HttpResponse

def prediction(request):
    result = "Prédiction pokémon"
    return HttpResponse(result)
