from django.urls import path
from social_media.views import *

urlpatterns = [
    path('<int:recipe_id>/rate-recipe/', RateRecipeView.as_view(), name='rate_recipe'),
    path('<int:recipe_id>/retrieve-rating/', RetrieveRating.as_view(), name='retrieve rating'),
    path('<int:recipe_id>/favorite-recipe/', FavoriteRecipeView.as_view(), name='favorite_recipe'),
    path('<int:recipe_id>/unfavorite-recipe/', UnFavoriteRecipeView.as_view(), name='unfavorite_recipe'),
    path('<int:recipe_id>/like-recipe/', LikeRecipeView.as_view(), name='like_recipe'),
    path('<int:recipe_id>/unlike-recipe/', UnLikeRecipeView.as_view(), name='unlike_recipe'),
    path('my-recipes/', MyRecipeView.as_view(), name='my_recipe'),
    path('popular-recipes/', PopularRecipeView.as_view(), name='popular_recipe'),
    path('<int:recipe_id>/comment-on-recipe/', CommentRecipeView.as_view(), name='comment_on_recipe'),
    path('comment-on-recipes/attach-files/<int:comment_id>/', CommentFileUploadView.as_view(), name='comment_recipe_files'),
    path('<int:recipe_id>/isliked/', IsLikedView.as_view(), name='isLiked'),
    path('<int:recipe_id>/isfavourited/', IsFavioritedView.as_view(), name='isFavourited'),
    # path('popular-recipes/', TrendingRecipeView.as_view(), name='trending_recipe'),
]
