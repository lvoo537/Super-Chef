import { Box, Grid, Tab, Tabs } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import React from 'react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';

function createCardList() {
    const cardList = [];
    for (let i = 0; i < 12; i++) {
        cardList.push(
            <Grid item key={i} md={3}>
                <RecipeCard
                    recipeName={`Recipe ${i + 1}`}
                    recipeDescription="Recipe Description"
                    recipeImg={'https://source.unsplash.com/random'}
                />
            </Grid>
        );
    }
    return cardList;
}

function MyRecipes() {
    const [value, setValue] = React.useState(0);
    var temp_list = createCardList();
    const [cardList, setCardList] = React.useState(temp_list);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setCardList(createCardList());
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            <Grid item xs={12}>
                {/** My Recipes Content Here  */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="my-recipes-tab"
                            centered
                        >
                            <Tab label="Created Recipes" id="created-recipes" />
                            <Tab label="Favorited Recipes" id="favorited-recipes" />
                            <Tab label="Interacted Recipes" id="interacted-recipes" />
                        </Tabs>
                    </Box>
                    <Grid justifyContent="start" alignItems="center" container rowSpacing={2}>
                        {cardList.map((reactElement) => reactElement)}
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default MyRecipes;
