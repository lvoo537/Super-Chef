from rest_framework import serializers
from recipes.models import Cuisine, Diet, Ingredient, Instruction, Recipe


class RecipeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe
        fields = '__all__'

class InstructionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Instruction
        fields = '__all__'

class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = '__all__'

class DietSerializer(serializers.ModelSerializer):

    class Meta:
        model = Diet
        fields = '__all__'


class CuisineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cuisine
        fields = '__all__'

