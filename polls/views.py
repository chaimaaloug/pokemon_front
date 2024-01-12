from django.shortcuts import render
from django.http import HttpResponse

def prediction(request):
    #result = "<h1 class='styled-title'>Prédiction pokémon</h1>"
    return render(request, 'prediction.html', {'title': 'Prédiction pokémon'})

