import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';

export default function RecipeCard({
    recipeImg,
    recipeName,
    recipeDescription,
    recipeId,
    recipeDesc2
}) {
    const navigate = useNavigate();
    let recipeDescShortened = recipeDescription;

    const { setRecipeId, setFromCard } = useRecipeContext();

    if (recipeDescription.length <= 200) {
        recipeDescShortened = recipeDescription.substring(0, 199);
    }

    // Call backend API to get recipe details given the recipe name (or id ?).
    // Create frontend page for recipe details page for each recipe.
    // Set the window.location.href to the url of the frontend page of given recipe name.
    const handleEditRecipeClick = (event) => {
        event.preventDefault();
        setRecipeId(recipeId);
        setFromCard(true);
        navigate(`/recipes/edit-recipe/${recipeId}`);
    };

    return (
        <Card sx={{ width: 345 }} margin="auto">
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={
                        typeof recipeImg === 'string' || recipeImg instanceof String
                            ? recipeImg
                            : 'https://source.unsplash.com/random'
                    }
                    alt="recipe image"
                />
                <CardContent sx={{ minHeight: 100, maxHeight: 100 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipeDescShortened}
                    </Typography>
                    {recipeDesc2 === undefined ? (
                        <div></div>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {recipeDesc2}
                        </Typography>
                    )}
                </CardContent>
                {recipeId === undefined ? (
                    <div></div>
                ) : (
                    <CardActions>
                        <Button size="small" onClick={handleEditRecipeClick}>
                            Edit Recipe
                        </Button>
                    </CardActions>
                )}
            </CardActionArea>
        </Card>
    );
}
