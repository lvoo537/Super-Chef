from django.db import models
from django.core.validators import FileExtensionValidator
# https://stackoverflow.com/questions/849142/how-to-limit-the-maximum-value-of-a-numeric-field-in-a-django-model
from django.core.validators import MaxValueValidator, MinValueValidator


class Recipe(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    likes = models.PositiveIntegerField(default=0)
    # this field is used to store users that liked the recipe and what recipes were liked by a user
    liked_by = models.ManyToManyField('accounts.MyUser', related_name='liked_recipes', null=True, blank=True)
    # This field is used to store total amount of users that rated the recipe
    number_of_users_rated = models.PositiveIntegerField(default=0)
    cooking_time = models.DurationField(null=False, blank=False)
    # This field is used to store total rating of the recipe
    total_rating = models.PositiveIntegerField(null=True, blank=True, default=0)
    servings = models.PositiveIntegerField(default=1)
    base_recipe = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    # Stores the average rating of the recipe
    average_rating = models.DecimalField(max_digits=12, decimal_places=10, null=True, blank=True, default=0)
    # price = models.DecimalField(max_digits=8, decimal_places=2, null=False, blank=False)
    # Stores number of users that marked the recipe as favorite
    total_users_marked_favorite = models.PositiveIntegerField(default=0)
    owner = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name='recipes', null=False,
                              blank=False)
    # Stores what user favourited the recipe and what recipe was favourited by a user
    favourited_by = models.ManyToManyField('accounts.MyUser', related_name='favourite_recipes', null=True, blank=True)
    prep_time = models.DurationField(null=False, blank=False)


class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments', null=False, blank=False)
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name='comments', null=False,
                             blank=False)
    comment = models.TextField(null=False, blank=False)


class Instruction(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='instructions', null=False, blank=False)
    step_number = models.PositiveIntegerField()
    cooking_time = models.DurationField(null=False, blank=False)
    prep_time = models.DurationField(null=False, blank=False)
    instruction = models.TextField(null=False, blank=False)
    # should this be null = false? blank = false?


class InstructionFile(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    recipe = models.ForeignKey(Instruction, on_delete=models.CASCADE,
                               related_name='photos_or_videos', null=False,
                               blank=False)
    file = models.FileField(upload_to='uploads/',
                            validators=[FileExtensionValidator(
                                allowed_extensions=['jpg', 'png', 'mp4'])],
                            null=False, blank=False)

class Diet(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    # should this be null = true? blank = true?
    recipes = models.ManyToManyField(Recipe, related_name='diets', null=True, blank=True)


class Cuisine(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    # should this be null = true? blank = true?
    recipes = models.ManyToManyField(Recipe, related_name='cuisines', null=True, blank=True)


Unit_of_Measure = [
    ('g', 'Grams'),
    ('kg', 'Kilograms'),
    ('ml', 'Milliliters'),
    ('l', 'Liters'),
    ('tsp', 'Teaspoon'),
    ('tbsp', 'Tablespoon'),
    ('cup', 'Cup'),
    ('oz', 'Ounce'),
    ('lb', 'Pound'),
    ('pinch', 'Pinch'),
    ('unit', 'Unit'),
]


class Ingredient(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    # should this be null = true? blank = true?
    recipes = models.ManyToManyField(Recipe, related_name='ingredients', null=True, blank=True)
    unit_of_measure = models.CharField(max_length=255, choices=Unit_of_Measure, null=False, blank=False)
    quantity = models.DecimalField(max_digits=8, decimal_places=2, null=False, blank=False)


class RecipeFile(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='photos_or_videos', null=False,
                               blank=False)
    file = models.FileField(upload_to='uploads/',
                            validators=[FileExtensionValidator(allowed_extensions=['jpg', 'png', 'mp4'])], null=False,
                            blank=False)


class CommentFile(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='photos_or_videos', null=True,
                               blank=True)
    file = models.FileField(upload_to='uploads/',
                            validators=[FileExtensionValidator(allowed_extensions=['jpg', 'png', 'mp4'])], null=False,
                            blank=False)


class Rating(models.Model):
    # should this be null = false? blank = false?
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratings', null=False, blank=False)
    # should this be null = false? blank = false?
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name='ratings', null=False,
                             blank=False)
    rating = models.PositiveIntegerField(null=False, blank=False,
                                         validators=[MaxValueValidator(5), MinValueValidator(1)])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'recipe'], name='unique_rating')
        ]
