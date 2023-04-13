import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import encodeImages from '../../Utils/encodeImages';
import { Grid, TextField, Box, Typography } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import IngredientsTable from '../../components/IngredientsTable/IngredientsTable';
import AddInstructionsComponent from '../../components/AddInstructionsComponent/AddInstructionsComponent';
import Button from '@mui/material/Button';
import { CreateRecipeIngredientsContext } from '../../contexts/CreateRecipeIngredientsContext/CreateRecipeIngredientsContext';
import Carousel from '../../components/Carousel/Carousel';
import * as React from 'react';
import DietsCuisineTable from '../../components/DietsCuisineTable/DietsCuisineTable';

function CreateRecipe() {
    const navigate = useNavigate();
    const { setRecipeId } = useRecipeContext();
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });
    const [ingredients, setIngredients] = useState([]);
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [instructions, setInstructions] = useState([]);

    const [diets, setDiets] = React.useState([]);
    const [cuisines, setCuisines] = React.useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // get values for recipe creation
        const data = new FormData(event.currentTarget);
        // TODO: Get recipe name, cooking time, recipe images, ingredients, instructions
        const dataToSend = {
            name: data.get('recipe-name'),
            cooking_time:
                data.get('cooking-time') !== ''
                    ? parseInt(data.get('cooking-time').toString())
                    : -1,
            prep_time:
                data.get('prep-time') !== '' ? parseInt(data.get('prep-time').toString()) : -1,
            base_recipe: data.get('base-recipe'),
            photos_or_videos: imagesEncoded,
            ingredients: ingredients,
            instructions: instructions,
            cuisine: cuisines,
            diets: diets
        };

        console.log(dataToSend);

        fetchBackend
            .post('/recipes/create/', dataToSend)
            .then((response) => {
                // From response, if successful, get the recipe ID. So update the recipe context.
            })
            .catch((error) => {});
    };

    const handleImages = (event) => {
        encodeImages(event, setImageName, setImagesEncoded);
    };

    return (
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
            <Grid item xs={12} sx={{ mt: 6 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid
                        container
                        spacing={2}
                        margin="auto"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item xs={1}>
                            <TextField
                                name="recipe-name"
                                id="recipe-name"
                                label="Recipe Name"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                name="cooking-time"
                                id="cooking-time"
                                label="Cooking Time"
                                variant="outlined"
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                name="prep-time"
                                id="prep-time"
                                label="Prep Time"
                                variant="outlined"
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={1} marginLeft={0} marginTop={0}>
                            <Button variant="contained" component="label">
                                Upload Recipe Images
                                <input
                                    type="file"
                                    accept="image/"
                                    hidden
                                    onChange={handleImages}
                                    multiple
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button variant="contained" type="submit">
                                Create Recipe
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="base-recipe"
                                id="base-recipe"
                                label="Base Recipe"
                                sx={{ width: 500 }}
                            />
                        </Grid>
                        {imagesEncoded.length === 0 ? (
                            <div></div>
                        ) : (
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Carousel images={imagesEncoded} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ mb: 3, mt: 3 }}>
                                        Recipe Ingredients
                                    </Typography>
                                    <CreateRecipeIngredientsContext.Provider
                                        value={{ ingredients, setIngredients }}
                                    >
                                        <IngredientsTable width={750} />
                                    </CreateRecipeIngredientsContext.Provider>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
                                        Recipe Instructions
                                    </Typography>
                                    <AddInstructionsComponent
                                        instructions={instructions}
                                        setInstructions={setInstructions}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ mb: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 3, mt: 3 }}>
                                        Related Cuisines/Diets
                                    </Typography>
                                    <DietsCuisineTable
                                        setCuisines={setCuisines}
                                        setDiets={setDiets}
                                        width={750}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CreateRecipe;
