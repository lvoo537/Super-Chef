from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import *

admin.site.register(MyUser)
admin.site.register(ShoppingList)
