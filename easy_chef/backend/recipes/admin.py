from django.contrib import admin
from recipes.models import *


admin.site.register(Recipe)
admin.site.register(Comment)
admin.site.register(Instruction)
admin.site.register(Diet)
admin.site.register(InstructionFile)
admin.site.register(Cuisine)
admin.site.register(Ingredient)
admin.site.register(RecipeFile)
admin.site.register(CommentFile)
admin.site.register(Rating)
