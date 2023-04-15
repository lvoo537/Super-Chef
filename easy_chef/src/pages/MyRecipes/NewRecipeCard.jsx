import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import Carousel from '../RecipeDetailsPage/recipeDetailescarousel';

export default function RecipeCard({ recipeImg, recipeName, recipeId }) {
    const navigate = useNavigate();

    const { setRecipeId, setFromCard } = useRecipeContext();

    // Call backend API to get recipe details given the recipe name (or id ?).
    // Create frontend page for recipe details page for each recipe.
    // Set the window.location.href to the url of the frontend page of given recipe name.
    const handleRecipeClick = (event) => {
        event.preventDefault();
        setRecipeId(recipeId);
        setFromCard(true);
        navigate(`/recipes/recipe-details/${recipeId}`);
    };

    return (
        <Card sx={{ width: 345 }} margin="auto">
            <CardActionArea onClick={handleRecipeClick}>
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
                {/*<Carousel images={recipeImg} width={650} height={300} />*/}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipeName}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
