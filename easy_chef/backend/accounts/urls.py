from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('<int:pk>/profile/edit/', EditProfileView.as_view(), name='edit_profile'),
    path('<int:pk>/profile/edit-avatar/', EditAvatar.as_view())
]
