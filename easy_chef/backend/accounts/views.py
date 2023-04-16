from django.core.validators import EmailValidator
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from accounts.models import MyUser, BlackListedToken,ShoppingList
from accounts.serializers import MyUserSerializer
import re
import datetime
from PIL import Image
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import IntegrityError
import base64


class IsTokenValid(BasePermission):
    def has_permission(self, request, view):
        user_id = request.user.id
        is_allowed_user = True
        token = request.auth
        try:
            is_blackListed = BlackListedToken.objects.get(user=user_id, token=token)
            if is_blackListed:
                is_allowed_user = False
        except BlackListedToken.DoesNotExist:
            is_allowed_user = True
        return is_allowed_user


class RegisterView(generics.GenericAPIView):
    serializer_class = MyUserSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            user = serializer.instance
            shopping_list = ShoppingList.objects.create(user=user)
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])
        user.save()

    def get_queryset(self):
        return MyUser.objects.all()


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = request.auth
            user = request.user
            BlackListedToken.objects.create(token=token, user=user)
            return Response('Success', status=200)
        except IntegrityError:
            return Response('Token already blacklisted', status=400)
        except:
            return Response('Error', status=500)


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request):
        errors = {}
        data = request.data
        # get the user from the token
        un = request.user

        if un is None:
            errors['user'] = 'This user does not exist'
            return Response(errors, status=400)

        try:
            user = MyUser.objects.get(username=un)
        except MyUser.DoesNotExist:
            errors["user_id"] = "This user does not exist"
            return Response(errors, status=400)

        if request.data.get("username", ""):
            temp_username = request.data.get("username")
            if MyUser.objects.filter(username=temp_username).exists():
                existing_user = MyUser.objects.get(username=temp_username)
                if user.username != existing_user.username:
                    errors['username'] = "A user with that username already exists"
                else:
                    user.username = temp_username
            else:
                user.username = temp_username

        if request.data.get("email", ""):
            email = request.data.get("email")
            validator = EmailValidator()

            if validator(email) is None:
                user.email = email
            else:
                errors["email"] = 'Enter a valid email address'

        if request.data.get("first_name", ""):
            user.first_name = request.data.get("first_name")

        if request.data.get("last_name", ""):
            user.last_name = request.data.get("last_name")

        if request.data.get("phone_number", ""):
            if not re.match(r'^\+?1?\d{9,15}$', request.data.get("phone_number")):
                errors['phone_number'] = "Phone number not valid"
            else:
                user.phone_number = request.data.get("phone_number", "")

        if request.data.get("date_of_birth", ""):
            try:
                date_str = request.data.get("date_of_birth", "")
                date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
                user.date_of_birth = date_obj
                # validate_date(data['date_of_birth'])
            except ValueError:
                errors['date_of_birth'] = "Enter a valid date of birth"

        if request.data.get("bio", ""):
            user.bio = request.data.get("bio")

        if request.data.get("location", ""):
            user.location = request.data.get("location")

        if request.data.get("old_password", ""):
            if check_password(request.data.get("old_password"), user.password):
                password = data.get('password', '')
                password2 = data.get('password2', '')

                if password != password2:
                    errors['password'] = "The two password fields didn't match"
                elif password == '' or password2 == '':
                    errors['password'] = "either password or password2 is empty"
                else:
                    user.set_password(password)
            else:
                errors["old_password"] = "Old password is wrong"
        # if MyUser.objects.filter(email=request.data.get("email", "")).exists():
        #     errors['email'] = "A user with that email already exists"
        if len(data.get('bio', '')) > 200:
            errors["bio"] = "bio is too long, make it less than 200 characters"

        if errors:
            return Response(errors, status=400)
        else:
            user.save()
            return Response({"message": "Update was a success"}, status=201)


class EditAvatar(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def post(self, request):

        errors = {}
        # data = request.data
        # get the user from the token

        hello = JWTAuthentication()
        header = hello.get_header(request)
        raw_token = hello.get_raw_token(header)
        validated_token = hello.get_validated_token(raw_token)
        un = hello.get_user(validated_token)

        if un is None:
            errors['user'] = 'This user does not exist'
            return Response(errors, status=400)
        try:
            user = MyUser.objects.get(username=un)

        except MyUser.DoesNotExist:
            errors["user_id"] = "This user does not exist"
            return Response(errors, status=400)

        # Get the uploaded image from the request
        avatar_img = request.FILES.get('avatar_img', '')

        if avatar_img:
            # Check if the uploaded file is an image
            try:
                img = Image.open(avatar_img)
                img.verify()
            except:
                errors["avatar_img"] = "Invalid image file."
                return Response(errors, status=400)

            # Assign the uploaded image to the user object
            user.avatar_img = avatar_img
            user.save()

        # Return a response indicating success
        return Response({"message": "Avatar updated successfully."})

class GetUserInfo(APIView):
    permission_classes = [IsAuthenticated, IsTokenValid]

    def get(self, request):
        errors = {}
        # get the user from the token
        un = request.user

        if un is None:
            errors['user'] = 'This user does not exist'
            return Response(errors, status=400)

        try:
            user = MyUser.objects.get(username=un)
        except MyUser.DoesNotExist:
            errors["user_id"] = "This user does not exist"
            return Response(errors, status=400)

        avatar_img = None
        if user.avatar_img:
            with open(user.avatar_img.path, 'rb') as f:
                image_data = f.read()
                avatar_img = base64.b64encode(image_data).decode('utf-8')

        user_serializer = MyUserSerializer(user)
        user_data = user_serializer.data
        user_data['avatar_img'] = avatar_img
        return Response(user_data)
