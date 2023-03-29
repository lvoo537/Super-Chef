from django.urls import path
from search.views import *

urlpatterns = [
    path('keyword/', KeywordView.as_view(), name='keyword'),
    path('filter-recipes/', FilterRecipesView.as_view(), name='filter_recipes'),
]