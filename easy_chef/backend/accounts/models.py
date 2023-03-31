from django.db import models
from django.contrib.auth.models import AbstractUser
from recipes.models import Recipe


#
class MyUser(AbstractUser):
    """
    Custom User Model
    """

    avatar_img = models.ImageField(upload_to='uploads/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    # email = models.EmailField(unique=False,null=False, blank=False)


class ShoppingList(models.Model):
    """
    Shopping List Model
    """
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE, null=False, blank=False)
    recipes = models.ManyToManyField(Recipe, related_name='shopping_lists', null=True, blank=True)
