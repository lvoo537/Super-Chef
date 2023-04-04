import * as React from 'react';
import Searchbar from '../../components/Searchbar/Searchbar';
import Grid from '@mui/material/Unstable_Grid2';
import Navbar from '../../components/Navbar/Navbar';
import Box from '@mui/material/Box';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import {
    FormControl,
    FormLabel,
    Pagination,
    Radio,
    RadioGroup,
    Stack,
    Typography
} from '@mui/material';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';

function MainPage() {
    // recipeCards is a list of RecipeCards
    // recipeName, recipeDescription, recipeImg should all be fetched by
    // calling the backend endpoint to filter by favorites/likes.
    const recipeCards = [];

    for (let i = 0; i < 12; i++) {
        recipeCards.push(
            <Grid key={i}>
                <RecipeCard
                    recipeName={`Recipe ${i + 1}`}
                    recipeDescription="Recipe Description"
                    recipeImg={'https://source.unsplash.com/random'}
                />
            </Grid>
        );
    }

    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterState, setFilterState] = useState('favorites');

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
            <Box
                display="flex"
                justifyContent="center"
                sx={{ flexDirection: 'column' }}
                marginX={25}
            >
                <Typography variant="h3">Popular Recipes</Typography>
                <FormControl sx={{ marginTop: '0.5%', marginLeft: '0.2%' }}>
                    <FormLabel id="popular-recipes-filter">Filter</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="popular-recipes-filter"
                        name="popular-recipes-filter"
                        defaultValue="favorites"
                        value={filterState}
                        onChange={(event, value) => {
                            setFilterState(value);
                        }}
                    >
                        <FormControlLabel value="favorites" control={<Radio />} label="Favorites" />
                        <FormControlLabel value="rating" control={<Radio />} label="Rating" />
                    </RadioGroup>
                </FormControl>
                <Grid
                    container
                    rowSpacing={2}
                    colSpacing={3}
                    justifyContent="start"
                    alignItems="center"
                >
                    {recipeCards.map((reactElement) => reactElement)}
                </Grid>
            </Box>
            <Stack pt="2%" alignItems="center" width="100%">
                <Pagination
                    count={totalPages}
                    onChange={(event, page) => {
                        setCurrPage(page);
                    }}
                />
            </Stack>
        </Grid>
    );
}

export default MainPage;
