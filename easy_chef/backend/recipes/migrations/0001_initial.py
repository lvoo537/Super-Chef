# Generated by Django 4.1.7 on 2023-04-16 01:57

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Instruction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step_number', models.PositiveIntegerField()),
                ('cooking_time', models.DurationField()),
                ('prep_time', models.DurationField()),
                ('instruction', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('likes', models.PositiveIntegerField(default=0)),
                ('number_of_users_rated', models.PositiveIntegerField(default=0)),
                ('cooking_time', models.DurationField()),
                ('total_rating', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('servings', models.PositiveIntegerField(default=1)),
                ('average_rating', models.DecimalField(blank=True, decimal_places=10, default=0, max_digits=12, null=True)),
                ('total_users_marked_favorite', models.PositiveIntegerField(default=0)),
                ('prep_time', models.DurationField()),
                ('base_recipe', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='recipes.recipe')),
                ('favourited_by', models.ManyToManyField(blank=True, null=True, related_name='favourite_recipes', to=settings.AUTH_USER_MODEL)),
                ('liked_by', models.ManyToManyField(blank=True, null=True, related_name='liked_recipes', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RecipeFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='uploads/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'png', 'mp4'])])),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos_or_videos', to='recipes.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveIntegerField(validators=[django.core.validators.MaxValueValidator(5), django.core.validators.MinValueValidator(1)])),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to='recipes.recipe')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='InstructionFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='uploads/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'png', 'mp4'])])),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos_or_videos', to='recipes.instruction')),
            ],
        ),
        migrations.AddField(
            model_name='instruction',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instructions', to='recipes.recipe'),
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('unit_of_measure', models.CharField(choices=[('g', 'Grams'), ('kg', 'Kilograms'), ('ml', 'Milliliters'), ('l', 'Liters'), ('tsp', 'Teaspoon'), ('tbsp', 'Tablespoon'), ('cup', 'Cup'), ('oz', 'Ounce'), ('lb', 'Pound'), ('pinch', 'Pinch'), ('unit', 'Unit')], max_length=255)),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=8)),
                ('recipes', models.ManyToManyField(blank=True, null=True, related_name='ingredients', to='recipes.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='Diet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('recipes', models.ManyToManyField(blank=True, null=True, related_name='diets', to='recipes.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='Cuisine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('recipes', models.ManyToManyField(blank=True, null=True, related_name='cuisines', to='recipes.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='CommentFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='uploads/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'png', 'mp4'])])),
                ('comment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='photos_or_videos', to='recipes.comment')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='recipes.recipe'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='rating',
            constraint=models.UniqueConstraint(fields=('user', 'recipe'), name='unique_rating'),
        ),
    ]