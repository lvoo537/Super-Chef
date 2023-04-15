from django.http import *
from django.shortcuts import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import *
from rest_framework.generics import *
from rest_framework.views import *
from rest_framework import status
from accounts.models import MyUser, ShoppingList
from accounts.views import IsTokenValid
from recipes.serializers import *
from recipes.models import *

from django.shortcuts import render
from django.utils.datastructures import MultiValueDict
from django.views import View
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import timedelta

from recipes.models import Instruction, InstructionFile, Recipe, RecipeFile
from recipes.serializers import CuisineSerializer, DietSerializer, \
    IngredientSerializer, \
    InstructionSerializer, \
    RecipeSerializer


# Create your views here.

class InstructionFileUpdate(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, instruction_id):
        # recipe_id = self.kwargs['recipe_id']
        try:
            instruction = Instruction.objects.get(id=instruction_id)
        except Instruction.DoesNotExist:
            return Response({'instruction_id': 'instruction does not exist.'}, status=404)

        if instruction.recipe.owner != request.user:
            return Response({'instruction_id': 'instruction does not belong to user.'}, status=403)

        instruction.photos_or_videos.all().delete()
        files = request.FILES
        if files:
            file_dict = MultiValueDict(files)
            for file_key in file_dict.keys():
                file_list = file_dict.getlist(file_key)
                for file in file_list:
                    name = file.name
                    InstructionFile.objects.create(name=name, recipe=instruction, file=file)
        # Return response
        response_data = {'Success message': 'Uploaded the file successfully.'}
        return Response(response_data, status=201)


class RecipeFileUpdate(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, recipe_id):
        # recipe_id = self.kwargs['recipe_id']
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'recipe_id': 'Recipe does not exist.'}, status=404)
        if recipe.owner != request.user:
            return Response({'recipe_id': 'Recipe does not belong to user.'}, status=403)

        recipe.photos_or_videos.all().delete()
        files = request.FILES
        if files:
            file_dict = MultiValueDict(files)
            for file_key in file_dict.keys():
                file_list = file_dict.getlist(file_key)
                for file in file_list:
                    name = file.name
                    recipe_file = RecipeFile.objects.create(name=name, recipe=recipe, file=file)
        # file = request.FILES['file']
        # name = file.name
        # recipe_file = RecipeFile.objects.create(name=name, recipe=recipe, file=file)
        # Return response
        response_data = {'Success message': 'Uploaded the files successfully.'}
        return Response(response_data, status=201)



class UpdateRecipe(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'recipe_id': 'Recipe does not exist.'}, status=404)
        errors = {}

        if recipe.owner != request.user:
            return Response({'recipe_id': 'Recipe does not belong to user.'}, status=403)

        is_there_a_base_recipe = False
        base_recipe_name = request.data.get('base_recipe', '')
        if base_recipe_name:
            # Find the base recipe in the database by its name
            try:
                base_recipe = Recipe.objects.filter(name__iexact=base_recipe_name).first()
                base_recipe = base_recipe.id
                is_there_a_base_recipe = True
            except Recipe.DoesNotExist:
                # Base recipe does not exist in the database
                errors['base_recipe'] = 'Base recipe does not exist'

        # Create Recipe Serializer
        if request.data['cooking_time']:
            cooking_time = timedelta(minutes=request.data['cooking_time'])
            request.data['cooking_time'] = cooking_time
        if request.data['prep_time']:
            prep_time = timedelta(minutes=request.data['prep_time'])
            request.data['prep_time'] = prep_time
        recipe_serializer = RecipeSerializer(recipe, data=request.data)

        # Create Cuisine Serializers
        cuisine_serializers = []
        cuisine_data = request.data.get('cuisine', [])
        for cuisine in cuisine_data:
            cuisine_serializer = CuisineSerializer(data=cuisine)
            if cuisine_serializer.is_valid():
                cuisine_serializers.append(cuisine_serializer)
            else:
                errors.setdefault('cuisine', {})
                for field, error_list in cuisine_serializer.errors.items():
                    for error in error_list:
                        errors['cuisine'].setdefault(cuisine['name'],
                                                     {}).setdefault(
                            field, []).append(error)

        # Create Diet Serializers
        diet_serializers = []
        diet_data = request.data.get('diets', [])
        for diet in diet_data:
            diet_serializer = DietSerializer(data=diet)
            if diet_serializer.is_valid():
                diet_serializers.append(diet_serializer)
            else:
                errors.setdefault('diets', {})
                for field, error_list in diet_serializer.errors.items():
                    for error in error_list:
                        errors['diets'].setdefault(diet['name'], {}).setdefault(
                            field,
                            []).append(
                            error)

        # Create Ingredient Serializers
        ingredient_serializers = []
        ingredient_data = request.data.get('ingredients', [])
        for ingredient in ingredient_data:
            ingredient_serializer = IngredientSerializer(data=ingredient)
            if ingredient_serializer.is_valid():
                ingredient_serializers.append(ingredient_serializer)
                # print(5)
            else:
                errors.setdefault('ingredients', {})
                for field, error_list in ingredient_serializer.errors.items():
                    for error in error_list:
                        errors['ingredients'].setdefault(ingredient['name'],
                                                         {}).setdefault(field,
                                                                        []).append(
                            error)

        # Create Instruction Serializers
        instruction_serializers = []
        instruction_data = request.data.get('instructions', [])
        for instruction in instruction_data:
            instruction['recipe'] = recipe.pk
            instruction_serializer = InstructionSerializer(data=instruction)
            if instruction_serializer.is_valid():
                instruction_serializers.append(instruction_serializer)
            else:
                errors.setdefault('instructions', {})
                for field, error_list in instruction_serializer.errors.items():
                    for error in error_list:
                        errors['instructions'].setdefault(
                            instruction['step_number'],
                            {}).setdefault(field,
                                           []).append(
                            error)

        # Check if there are any errors
        if errors:
            # recipe.delete()
            return Response(errors, status=400)
        if recipe_serializer.is_valid():
            recipe = recipe_serializer.save()
        else:
            errors.update(recipe_serializer.errors)
            return Response(errors, status=400)

        if is_there_a_base_recipe:
            recipe.base_recipe = base_recipe
            recipe.save()

        recipe.ingredients.all().delete()
        recipe.diets.all().delete()
        recipe.cuisines.all().delete()
        recipe.instructions.all().delete()
        recipe.save()

        # Save Cuisine Serializers
        cuisine_objs = []
        for cuisine_serializer in cuisine_serializers:
            cuisine_objs.append(cuisine_serializer.save())

        # Save Diet Serializers
        diet_objs = []
        for diet_serializer in diet_serializers:
            diet_objs.append(diet_serializer.save())

        # Save Ingredient Serializers
        ingredient_objs = []
        for ingredient_serializer in ingredient_serializers:
            ingredient_objs.append(ingredient_serializer.save())

        # Save Instruction Serializers
        instruction_objs = []
        for instruction_serializer in instruction_serializers:
            instruction_objs.append(instruction_serializer.save(recipe=recipe))

        # Attach related objects to Recipe
        # recipe.cuisine.set(cuisine_objs)
        for obj in cuisine_objs:
            obj.recipes.add(recipe)
        # recipe.diets.set(diet_objs)
        for obj in diet_objs:
            obj.recipes.add(recipe)
        # recipe.ingredients.set(ingredient_objs)
        for obj in ingredient_objs:
            obj.recipes.add(recipe)
        # recipe.instructions.set(instruction_objs)
        # for obj in ingredient_objs:
        #     obj.add(recipe)

        # Return response
        response_data = {'Success message': 'Updated the Recipe successfully.'}
        return Response(response_data, status=201)

class CreateView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request):
        errors = {}

        is_there_a_base_recipe = False
        base_recipe_name = request.data.get('base_recipe', '')
        if base_recipe_name:
            # Find the base recipe in the database by its name
            try:
                base_recipe = Recipe.objects.filter(name__iexact=base_recipe_name).first()
                base_recipe = base_recipe.id
                is_there_a_base_recipe = True
            except Recipe.DoesNotExist:
                # Base recipe does not exist in the database
                errors['base_recipe'] = 'Base recipe does not exist'
#
        # Create Recipe Serializer
        if request.data['cooking_time']:
            cooking_time = timedelta(minutes=request.data['cooking_time'])
            request.data['cooking_time'] = cooking_time
        if request.data['prep_time']:
            prep_time = timedelta(minutes=request.data['prep_time'])
            request.data['prep_time'] = prep_time
        request.data['owner'] = request.user.id
        if is_there_a_base_recipe:
            request.data['base_recipe'] = base_recipe
        recipe_serializer = RecipeSerializer(data=request.data)

        if recipe_serializer.is_valid():

            recipe = recipe_serializer.save()
        else:
            errors.update(recipe_serializer.errors)
            return Response(errors, status=400)
#
#         if is_there_a_base_recipe:
#
#             recipe.base_recipe = base_recipe
#             recipe.save()



        # Create Cuisine Serializers
        cuisine_serializers = []
        cuisine_data = request.data.get('cuisine', [])
        for cuisine in cuisine_data:
            cuisine_serializer = CuisineSerializer(data=cuisine)
            if cuisine_serializer.is_valid():
                cuisine_serializers.append(cuisine_serializer)
            else:
                errors.setdefault('cuisine', {})
                for field, error_list in cuisine_serializer.errors.items():
                    for error in error_list:
                        errors['cuisine'].setdefault(cuisine['name'], {}).setdefault(
                            field, []).append(error)

        # Create Diet Serializers
        diet_serializers = []
        diet_data = request.data.get('diets', [])
        for diet in diet_data:
            diet_serializer = DietSerializer(data=diet)
            if diet_serializer.is_valid():
                diet_serializers.append(diet_serializer)
            else:
                errors.setdefault('diets', {})
                for field, error_list in diet_serializer.errors.items():
                    for error in error_list:
                        errors['diets'].setdefault(diet['name'], {}).setdefault(field,
                                                                                []).append(
                            error)

        # Create Ingredient Serializers
        ingredient_serializers = []
        ingredient_data = request.data.get('ingredients', [])
        for ingredient in ingredient_data:
            ingredient_serializer = IngredientSerializer(data=ingredient)
            if ingredient_serializer.is_valid():
                ingredient_serializers.append(ingredient_serializer)
                # print(5)
            else:
                errors.setdefault('ingredients', {})
                for field, error_list in ingredient_serializer.errors.items():
                    for error in error_list:
                        errors['ingredients'].setdefault(ingredient['name'],
                                                         {}).setdefault(field,
                                                                        []).append(
                            error)

        # Create Instruction Serializers
        instruction_serializers = []
        instruction_data = request.data.get('instructions', [])
        for instruction in instruction_data:
            instruction['recipe'] = recipe.pk
            instruction_serializer = InstructionSerializer(data=instruction)
            if instruction_serializer.is_valid():
                instruction_serializers.append(instruction_serializer)
            else:
                errors.setdefault('instructions', {})
                for field, error_list in instruction_serializer.errors.items():
                    for error in error_list:
                        errors['instructions'].setdefault(instruction['step_number'],
                                                          {}).setdefault(field,
                                                                         []).append(
                            error)

        # Check if there are any errors
        if errors:
            recipe.delete()
            return Response(errors, status=400)

        # Save Cuisine Serializers
        cuisine_objs = []
        for cuisine_serializer in cuisine_serializers:
            cuisine_objs.append(cuisine_serializer.save())

        # Save Diet Serializers
        diet_objs = []
        for diet_serializer in diet_serializers:
            diet_objs.append(diet_serializer.save())

        # Save Ingredient Serializers
        ingredient_objs = []
        for ingredient_serializer in ingredient_serializers:
            ingredient_objs.append(ingredient_serializer.save())

        # Save Instruction Serializers
        instruction_objs = []
        for instruction_serializer in instruction_serializers:
            instruction_objs.append(instruction_serializer.save(recipe=recipe))

        # Attach related objects to Recipe
        # recipe.cuisine.set(cuisine_objs)
        for obj in cuisine_objs:
            obj.recipes.add(recipe)
        # recipe.diets.set(diet_objs)
        for obj in diet_objs:
            obj.recipes.add(recipe)
        # recipe.ingredients.set(ingredient_objs)
        for obj in ingredient_objs:
            obj.recipes.add(recipe)
        # recipe.instructions.set(instruction_objs)
        # for obj in ingredient_objs:
        #     obj.add(recipe)

        # Return response
        response_data = {'recipe_id': recipe.id, 'Success message': 'Created the Recipe successfully.'}
        return Response(response_data, status=201)

class RecipeFileUpload(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, recipe_id):
        # recipe_id = self.kwargs['recipe_id']
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'recipe_id': 'Recipe does not exist.'}, status=404)
        if recipe.owner != request.user:
            return Response({'user': 'You are not the owner of this recipe.'}, status=403)
        # recipe.photos_or_videos.all().delete()
        files = request.FILES
        if files:

            file_dict = MultiValueDict(files)
            for file_key in file_dict.keys():
                file_list = file_dict.getlist(file_key)
                for file in file_list:
                    name = file.name
                    # print(5)
                    recipe_file = RecipeFile.objects.create(name=name,
                                                            recipe=recipe,
                                                            file=file)
        # file = request.FILES['file']
        # name = file.name
        # recipe_file = RecipeFile.objects.create(name=name, recipe=recipe, file=file)
        # Return response
        response_data = {'Success message': 'Uploaded the files successfully.'}
        return Response(response_data, status=201)


class InstructionFileUpload(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, instruction_id):
        # recipe_id = self.kwargs['recipe_id']
        try:
            instruction = Instruction.objects.get(id=instruction_id)
        except Instruction.DoesNotExist:
            return Response({'instruction_id': 'instruction does not exist.'}, status=404)
        if instruction.recipe.owner != request.user:
            return Response({'user': 'You are not the owner of this recipe.'}, status=403)
        # file = request.FILES['file']
        # name = file.name
        # instruction_file = InstructionFile.objects.create(name=name, recipe=instruction, file=file)
        files = request.FILES
        if files:
            file_dict = MultiValueDict(files)
            for file_key in file_dict.keys():
                file_list = file_dict.getlist(file_key)
                for file in file_list:
                    name = file.name
                    InstructionFile.objects.create(name=name,
                                                   recipe=instruction,
                                                   file=file)
        # Return response
        response_data = {'Success message': 'Uploaded the file successfully.'}
        return Response(response_data, status=201)


class IngredientSearchView(View):
    """
    This view is used to search for ingredients.
    GET /recipes/ingredient-search/
    Payloads:
        - recipe_name
    Returns: List of ingredients that match the keyword
    """

    def get(self, request):
        recipe_name = request.GET.get('recipe_name', None)
        if recipe_name is None:
            return HttpResponseBadRequest("Keyword is required")
        # name__icontains is used to search for ingredients that contain the keyword (non-case sensitive)
        ingredients = Ingredient.objects.filter(name__icontains=recipe_name)
        # many=True is used to serialize the list of ingredients
        serializer = IngredientSerializer(ingredients, many=True)
        # serializer.data is a list of JSON objects each representing an ingredient model
        return JsonResponse({'ingredients': serializer.data}, status=200)


class DeleteRecipe(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def delete(self, request):

        recipe_id = request.data.get('recipe_id', '')
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'error': 'Recipe not found.'}, status=404)

        if recipe.owner != request.user:
            return Response({'recipe_id': 'Recipe does not belong to user.'}, status=403)

        recipe.delete()
        return Response({'success message': 'Recipe was deleted from the database'}, status=204)


class RecipeDetails(APIView):
    """
    This view is used to get the details of a recipe.
    GET /recipes/recipe-details/<int:recipe_id>/
    Returns: Recipe details as specified in model
    """

    def get(self, request,recipe_id):
        # recipe_name = request.GET.get('recipe_name', None)
        # if recipe_name is None:
        #     return Response({'error': 'Recipe name is required'}, status=status.HTTP_400_BAD_REQUEST)
        # recipe = Recipe.objects.filter(name=recipe_name)
        # if len(recipe) == 0:
        #     return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
        # serializer = RecipeSerializer(recipe[0])
        # return Response(serializer.data, status=status.HTTP_200_OK)
        return_data ={}
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'error': 'Recipe not found'}, status=404)

        recipe_serializer = RecipeSerializer(recipe)
        return_data = recipe_serializer.data
        instructions = Instruction.objects.filter(recipe=recipe_id).order_by('step_number')
        instruction_serializer = InstructionSerializer(instructions,many=True)
        comments = Comment.objects.filter(recipe=recipe_id)
        comment_serializer = CommentSerializer(comments,many=True)
        diets = Diet.objects.filter(recipes=recipe_id)
        diet_serializer = DietSerializer(diets,many=True)
        cuisines = Cuisine.objects.filter(recipes=recipe_id)
        cuisine_serializer = CuisineSerializer(cuisines,many=True)
        ingredients = Ingredient.objects.filter(recipes=recipe_id)
        ingredient_serializer= IngredientSerializer(ingredients,many=True)
        return_data["ingredients"] = ingredient_serializer.data
        return_data["cuisines"] = cuisine_serializer.data
        return_data["diets"] = diet_serializer.data
        return_data["instructions"] =instruction_serializer.data
        return_data["comments"] = comment_serializer.data

        return Response(return_data, status=200)


class RetrieveCommentFilesView(APIView):
    def get(self, request, comment_id):
        comment_files = CommentFile.objects.filter(comment=comment_id)
        files = []
        for comment_file in comment_files:
            file_path = comment_file.file.path
            file = open(file_path, 'rb')
            files.append(file)

        response = FileResponse(files)
        return response


class RetrieveRecipeFilesView(APIView):
    def get(self, request, recipe_id):
        recipe_files = RecipeFile.objects.filter(recipe=recipe_id)
        files = []
        for recipe_file in recipe_files:
            file_path = recipe_file.file.path
            file = open(file_path, 'rb')
            files.append(file)

        response = FileResponse(files)
        return response


class RetrieveInstructionFilesView(APIView):
    def get(self, request, instruction_id):
        instruction_files = InstructionFile.objects.filter(recipe=instruction_id)
        files = []
        for instruction_file in instruction_files:
            file_path = instruction_file.file.path
            file = open(file_path, 'rb')
            files.append(file)

        response = FileResponse(files)
        return response


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, recipe_id):
        user = request.user
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response(
                {'Error': f'Recipe with id {recipe_id} does not exist'},
                status=400)
        shopping_list = ShoppingList.objects.get(user=user)
        shopping_list.recipes.add(recipe)
        shopping_list.save()
        return Response({"message": "Successfully added recipe to the shopping list."}, status=201)

class ReturnAllRecipes(ListAPIView):
    serializer_class = RecipeSerializer
    def get_queryset(self):
        return Recipe.objects.all()


class ShoppingLists(APIView):

    """
    This view is used to get the shopping list of a recipe.
    GET /recipes/shopping-list/
    Payloads:
        - username (username of the user)
    Returns: List of ingredients and their quantities
             e.g. {recipe: {ingredient_name: {amount, unit_of_measure}}, servings}
    Note:
        The user must be logged in to use this view.
    """
    permission_classes = [IsAuthenticated, IsTokenValid]

    def get(self, request):

        user = request.user
        print(user)
        if user is None:
            return HttpResponseBadRequest("User not found")

        try:
            shopping_list = ShoppingList.objects.get(user=user)
        except ShoppingList.DoesNotExist:
            return HttpResponseBadRequest("Shopping list not found", status=404)

        if shopping_list is None:
            return HttpResponseBadRequest("Shopping list not found")
        recipes = shopping_list.recipes.all()
        if recipes is None:
            return HttpResponseBadRequest("List of recipes are required")

        serializer = RecipeSerializer(recipes, many=True)
        result_json = {'recipes': serializer.data}
        return Response(result_json)

class UpdateRecipeServings(APIView):
    """
    This view is used to update the amount of servings of recipe.
    POST /recipes/update-recipe-servings
    Payloads:
        - username (username of the user)
        - recipe_name (name of recipe)
        - amount (new amount of servings)
    Returns: 200 if successful.
    Note:
        The user must be logged in to use this view.
    """
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated, IsTokenValid]

    def get_queryset(self):
        recipe_name = self.request.GET.get('recipe_name', None)
        username = self.request.GET.get('username', None)
        if username and recipe_name:
            return Recipe.objects.filter(name=recipe_name, owner__username=username)
        return None

    def get_object(self):
        queryset = self.get_queryset()
        if queryset:
            return queryset.first()

    def put(self, request):
        username = self.request.GET.get('username', None)
        if not username:
            return HttpResponseBadRequest("Username is required")
        user = get_object_or_404(MyUser, username=username)
        if user.username != request.user.username:
            return HttpResponseForbidden("You are not allowed to update this recipe")
        if not self.get_queryset():
            return HttpResponseBadRequest("Recipe does not exist or is not given as query")

        instance = self.get_object()
        amount = self.request.GET.get('amount', None)
        if amount is None:
            return HttpResponseBadRequest("Amount is required")
        instance.servings = amount
        instance.save()
        return HttpResponse(status=200)
