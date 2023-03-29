from rest_framework import serializers

from recipes.models import Rating, Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'name', 'likes',
                  'number_of_users_rated',
                  'cooking_time', 'total_rating',
                  'servings', 'base_recipe',
                  'total_users_marked_favorite',
                  'owner', 'favourited_by', 'prep_time']


class RateRecipeSerializer:
    pass