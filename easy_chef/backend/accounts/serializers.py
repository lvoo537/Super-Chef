from django.core.validators import validate_email
from rest_framework import serializers
import re
import datetime

from accounts.models import MyUser


class MyUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = MyUser
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password2', 'date_of_birth', 'phone_number', 'avatar_img', 'bio', 'location']

    def validate(self, data):
        errors = {}

        if data['password'] != data['password2']:
            errors['password'] = "Passwords must match"

        try:
            validate_email(data['email'])
        except serializers.ValidationError:
            errors['email'] = "Enter a valid email address"

        try:
            date_str = data['date_of_birth'].strftime('%Y-%m-%d')
            date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
            # validate_date(data['date_of_birth'])
        except ValueError:
            errors['date_of_birth'] = "Enter a valid date of birth"

        if MyUser.objects.filter(username=data['username']).exists():
            existing_user = MyUser.objects.get(username=data['username'])
            if existing_user.check_password(data['password']): # if the password is correct
                errors['username'] = "A user with that username and password already exists"

        if MyUser.objects.filter(email=data['email']).exists():
            errors['email'] = "A user with that email already exists"

        if not re.match(r'^\+?1?\d{9,15}$', data['phone_number']):
            errors['phone_number'] = "Phone number not valid"

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        user = MyUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            date_of_birth=validated_data['date_of_birth'],
            phone_number=validated_data['phone_number'],
            avatar_img=validated_data.get('avatar_img', None),
            bio=validated_data.get('bio', None),
            location=validated_data.get('location', None),
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
