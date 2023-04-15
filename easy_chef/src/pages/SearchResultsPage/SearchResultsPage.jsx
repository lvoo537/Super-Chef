import Grid from '@mui/material/Unstable_Grid2';
import Navbar from '../../components/Navbar/Navbar';
import Box from '@mui/material/Box';
import Searchbar from '../../components/Searchbar/Searchbar';
import * as React from 'react';
import { useSearchQueryResponseContext } from '../../contexts/SearchQueryResponseContext/SearchQueryResponseContext';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { Typography } from '@mui/material';

let cardId = 0;
export default function SearchResultsPage() {
    const { searchQueryResponse } = useSearchQueryResponseContext();

    const searchResultCards = [];

    for (let obj of searchQueryResponse) {
        cardId += 1;
        let desc = '';
        let name = '';
        let recipeId = '';
        if (obj.model === 'recipes.recipe') {
            desc = `Cooking Time: ${obj.fields.cooking_time}, Likes: ${obj.fields.likes}`;
            name = 'Recipe: ' + obj.fields.name;
            recipeId = obj.pk;
        } else if (obj.model === 'accounts.myuser') {
            desc = `Name: ${obj.fields.first_name + ' ' + obj.fields.last_name}`;
            name = 'Creator: ' + obj.fields.username;
        } else if (obj.model === 'recipes.ingredient') {
            desc = `In batches of ${obj.fields.quantity}, measured by ${obj.fields.unit_of_measure}`;
            name = `Ingredient: ${obj.fields.name}`;
        }
        searchResultCards.push(
            <Grid key={cardId}>
                <RecipeCard
                    recipeName={name}
                    recipeDescription={desc}
                    recipeImg="https://source.unsplash.com/random"
                    recipeId={recipeId !== '' ? recipeId : undefined}
                />
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="18vh">
                    <Searchbar />
                </Box>
            </Grid>
            <Box>
                <Grid
                    container
                    rowSpacing={2}
                    colSpacing={3}
                    justifyContent="start"
                    alignItems="center"
                >
                    {searchResultCards.map((reactElement) => reactElement)}
                </Grid>
                {searchQueryResponse.length === 0 ? (
                    <Typography variant="h5">No results found.</Typography>
                ) : (
                    <div></div>
                )}
            </Box>
        </Grid>
    );
}
