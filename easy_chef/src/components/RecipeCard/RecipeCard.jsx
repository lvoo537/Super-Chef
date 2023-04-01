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
