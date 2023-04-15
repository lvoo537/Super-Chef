from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/edit/', EditProfileView.as_view(), name='edit_profile'),
    path('profile/edit-avatar/', EditAvatar.as_view()),
    path('get-user-info/', GetUserInfo.as_view())
]
