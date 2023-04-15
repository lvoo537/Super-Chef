from django.shortcuts import render
from django.utils.datastructures import MultiValueDict
from django.views import View
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, get_object_or_404, ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.views import IsTokenValid
from recipes.models import Rating, Recipe, Comment, CommentFile
from social_media.serializers import RecipeRatingSerializer, RecipeSerializer

from rest_framework.parsers import MultiPartParser


# Reference https://realpython.com/sort-python-dictionary/

# from social_media.serializers import RateRecipeSerializer


# Create your views here.
class RateRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    # serializer_class = RateRecipeSerializer

    def post(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        rating = request.data.get('rating', '')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        rating_obj = Rating.objects.filter(user=user, recipe=recipe).first()
        if not rating:
            return Response({'message': 'Rating is required'}, status=status.HTTP_400_BAD_REQUEST)
        if rating < 1 or rating > 5:
            return Response({'message': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
        if rating_obj:
            temp_rating = rating_obj.rating
            rating_obj.rating = rating
            rating_obj.save()
            # update rating of recipe
            recipe.total_rating -= temp_rating
            recipe.total_rating += rating
            recipe.average_rating = recipe.total_rating / recipe.number_of_users_rated
            recipe.save()
            return Response({'message': 'Rating updated successfully'}, status=status.HTTP_200_OK)
        else:
            Rating.objects.create(user=user, recipe=recipe, rating=rating)
            # update rating of recipe and number of users rated
            recipe.number_of_users_rated += 1
            recipe.total_rating += rating
            recipe.average_rating = recipe.total_rating / recipe.number_of_users_rated
            recipe.save()
            return Response({'message': 'Rating created successfully'}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        rating = request.data.get('rating', '')
        if not rating:
            return Response({'message': 'Rating is required'}, status=status.HTTP_400_BAD_REQUEST)
        if rating < 1 or rating > 5:
            return Response({'message': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
        recipe = get_object_or_404(Recipe, id=recipe_id)
        rating_obj = Rating.objects.filter(user=user, recipe=recipe).first()
        if rating_obj:
            temp_rating = rating_obj.rating
            rating_obj.rating = rating
            rating_obj.save()
            # update rating of recipe
            recipe.total_rating -= temp_rating
            recipe.total_rating += rating
            recipe.average_rating = recipe.total_rating / recipe.number_of_users_rated
            recipe.save()
            return Response({'message': 'Rating updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)


class FavoriteRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)
        if recipe in user.favourite_recipes.all():
            return Response({'message': 'Recipe already favorited'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.favourite_recipes.add(recipe)
            recipe.total_users_marked_favorite += 1
            recipe.save()
            return Response({'message': 'Recipe favorited successfully'}, status=status.HTTP_200_OK)


class LikeRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)
        if recipe in user.liked_recipes.all():
            return Response({'message': 'Recipe already liked'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.liked_recipes.add(recipe)
            recipe.save()
            return Response({'message': 'Recipe liked successfully'}, status=status.HTTP_200_OK)


class UnFavoriteRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def delete(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)
        if recipe in user.favourite_recipes.all():
            user.favourite_recipes.remove(recipe)
            recipe.total_users_marked_favorite -= 1
            recipe.save()
            return Response({'message': 'Recipe unfavorited successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Recipe not favorited'}, status=status.HTTP_400_BAD_REQUEST)


class UnLikeRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def delete(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)
        if recipe in user.liked_recipes.all():
            user.liked_recipes.remove(recipe)
            recipe.save()
            return Response({'message': 'Recipe disliked successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Recipe not liked'}, status=status.HTTP_400_BAD_REQUEST)

class MyRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def get(self, request, *args, **kwargs):
        my_recipes = {
            'recipes_created': [],
            'marked_fav': [],
            'interacted': [],
        }
        # created recipes
        recipes_created = request.user.recipes.all()
        recipes_created_serializer = RecipeSerializer(recipes_created, many=True)
        my_recipes['recipes_created'] = recipes_created_serializer.data

        # marked favorite recipes
        marked_fav = request.user.favourite_recipes.all()
        marked_fav_serializer = RecipeSerializer(marked_fav, many=True)
        my_recipes['marked_fav'] = marked_fav_serializer.data

        # interacted recipes
        # Created
        if recipes_created_serializer.data:
            my_recipes['interacted'].extend(recipes_created_serializer.data)


        lst = []
        for something in my_recipes['interacted']:
            lst.append(something['id'])

        # liked
        recipes_liked = request.user.liked_recipes.all()
        recipes_liked_serializer = RecipeSerializer(recipes_liked, many=True)
        if recipes_liked_serializer.data:
            for data in recipes_liked_serializer.data:
                if data['id'] not in lst:
                    my_recipes['interacted'].append(data)
                    lst.append(data['id'])

        # rated
        user_ratings = Rating.objects.filter(user=request.user)
        recipes_rated_by_user = Recipe.objects.filter(ratings__in=user_ratings)
        recipes_rated_serializer = RecipeSerializer(recipes_rated_by_user, many=True)
        if recipes_rated_serializer.data:
            for data in recipes_rated_serializer.data:
                if data['id'] not in lst:
                    my_recipes['interacted'].append(data)
                    lst.append(data['id'])


        # commented
        user_comments = Comment.objects.filter(user=request.user)
        recipes_commented_on_by_user = Recipe.objects.filter(comments__in=user_comments)
        recipes_commented_serializer = RecipeSerializer(recipes_commented_on_by_user, many=True)

        if recipes_commented_serializer.data:
            for data in recipes_commented_serializer.data:
                 if data['id'] not in lst:
                     my_recipes['interacted'].append(data)
                     lst.append(data['id'])


        return Response({'my_recipes': my_recipes}, status=status.HTTP_200_OK)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000



class PopularRecipeView(ListAPIView):
    serializer_class = RecipeSerializer
    pagination_class = StandardResultsSetPagination


    def get_queryset(self):
        favourited = self.request.GET.get('favorites', '').lower() == 'true'
        rated = self.request.GET.get('rating', '').lower() == 'true'
        # overall rating or the number of users marked them as favorite
        if favourited and rated:
            # query recipes that have highest average rating and highest number of users marked them as favorite
            return Recipe.objects.order_by('-total_users_marked_favorite', '-average_rating')
        elif favourited:
            return Recipe.objects.order_by('-total_users_marked_favorite')
        elif rated:
            return Recipe.objects.order_by('-average_rating')
        else:
            return Recipe.objects.all()


class CommentRecipeView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request, *args, **kwargs):
        recipe_id = self.kwargs.get('recipe_id')
        user = self.request.user
        comment = request.data.get('comment', '')
        if not comment:
            return Response({'message': 'Comment is required'}, status=status.HTTP_400_BAD_REQUEST)
        # comment must be less than 200 characters
        if len(comment) > 200:
            return Response({'message': 'Comment must be less than 200 characters'}, status=status.HTTP_400_BAD_REQUEST)
        recipe = get_object_or_404(Recipe, id=recipe_id)
        Comment.objects.create(user=user, recipe=recipe, comment=comment)
        return Response({'message': 'Comment created successfully'}, status=status.HTTP_200_OK)


class CommentFileUploadView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        # recipe_id = self.kwargs['recipe_id']

        try:
            comment_id = self.kwargs.get('comment_id')
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({'comment_id': 'Comment does not exist.'}, status=404)

        files = request.FILES
        if files:
            file_dict = MultiValueDict(files)
            for file_key in file_dict.keys():
                file_list = file_dict.getlist(file_key)
                for file in file_list:
                    name = file.name
                    if not file.name.endswith(('.jpg', '.png', '.mp4')):
                        return Response({'message': 'File must be an image or video'}, status=status.HTTP_400_BAD_REQUEST)

                    # print(5)
                    recipe_file = CommentFile.objects.create(name=name, comment=comment, file=file)
        # file = request.FILES['file']
        # name = file.name
        # recipe_file = RecipeFile.objects.create(name=name, recipe=recipe, file=file)
        # Return response
        response_data = {'Success message': 'Uploaded the files successfully.'}
        return Response(response_data, status=status.HTTP_201_CREATED)




        #
        # files = request.FILES.getlist('file')
        # print(files)
        # # check if files end with .jpg, .png, .mp4
        # for file in files:
        #     if not file.name.endswith(('.jpg', '.png', '.mp4')):
        #         return Response({'message': 'File must be an image or video'}, status=status.HTTP_400_BAD_REQUEST)
        #
        # for file in files:
        #     comment_file = CommentFile.objects.create(name=file.name, comment=comment, file=file)
        #     comment_file.save()
        #
        # # Return response


class RetrieveRating(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, recipe_id):
        # Get the rating for the requested recipe from the authenticated user
        try:
            rating = Rating.objects.get(recipe_id=recipe_id, user=request.user)
            serializer = RecipeRatingSerializer(rating)
            return Response(serializer.data)
        except Rating.DoesNotExist:
            return Response({'error': 'You have not rated this recipe.'}, status=404)

