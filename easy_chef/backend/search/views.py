from django.shortcuts import render
from django.views import View
from django.http import *
from django.core import serializers as django_serializer

from accounts.models import MyUser
from recipes.models import *
from recipes.serializers import *


class KeywordView(View):
    """
    This view is used to search for recipe name, ingredient, or by creator of recipe.
    GET /search/keyword/
    Payloads:
        - keyword
    Returns: List of either recipe name, ingredient, or creator of recipe
    """
    def get(self, request):
        keyword = request.GET.get('keyword', None)
        all_results = []
        if keyword is None or keyword == "":
            return HttpResponseBadRequest("Keyword is required")
        recipe_names = Recipe.objects.filter(name__icontains=keyword)
        for recipe in recipe_names:
            all_results.append(recipe)
        ingredients = Ingredient.objects.filter(name__icontains=keyword)
        for ingredient in ingredients:
            all_results.append(ingredient)
        recipe_creators = MyUser.objects.filter(username__icontains=keyword)
        for creator in recipe_creators:
            all_results.append(creator)
        return JsonResponse({'keywordResults': django_serializer.serialize("json", all_results)}, status=200)


class FilterRecipesView(View):
    """
    This view is used to filter results based on cuisine, diet, or cooking time.
    GET /search/filter-recipes/
    Payloads:
        - filter_keyword
    Returns: List of recipe objects based on the filter from filter_keyword
    """
    def get(self, request):
        filter_keyword = request.GET.get('filter_keyword', None)
        if filter_keyword is None or filter_keyword == "":
            return HttpResponseBadRequest("Filter keyword is required")
        all_results = []
        diets = Diet.objects.filter(name__icontains=filter_keyword)
        for diet in diets:
            all_results.append(diet)
        cuisines = Cuisine.objects.filter(name__icontains=filter_keyword)
        for cuisine in cuisines:
            all_results.append(cuisine)
        cooking_time = Recipe.objects.filter(cooking_time__icontains=filter_keyword)
        for time in cooking_time:
            all_results.append(time)
        return JsonResponse({'filterResults': django_serializer.serialize("json", all_results)}, status=200)
