import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function RecipeCard({ recipeImg, recipeName, recipeDescription }) {
    let recipeDescShortened = recipeDescription;

    if (recipeDescription.length <= 200) {
        recipeDescShortened = recipeDescription.substring(0, 199);
    }

    // Call backend API to get recipe details given the recipe name (or id ?).
    // Create frontend page for recipe details page for each recipe.
    // Set the window.location.href to the url of the frontend page of given recipe name.

    return (
        <Card sx={{ width: 345 }} margin="auto">
            <CardActionArea
                onClick={() => {
                    window.location.href = '#';
                }}
            >
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
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipeDescShortened}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
