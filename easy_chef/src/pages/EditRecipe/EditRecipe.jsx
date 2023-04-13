import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useEffect, useState } from 'react';
import * as React from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import encodeImages from '../../Utils/encodeImages';
import { Box, Grid, TextField, Typography } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import Button from '@mui/material/Button';
import Carousel from '../../components/Carousel/Carousel';
import { CreateRecipeIngredientsContext } from '../../contexts/CreateRecipeIngredientsContext/CreateRecipeIngredientsContext';
import IngredientsTable from '../../components/IngredientsTable/IngredientsTable';
import AddInstructionsComponent from '../../components/AddInstructionsComponent/AddInstructionsComponent';
import DietsCuisineTable from '../../components/DietsCuisineTable/DietsCuisineTable';
import useSWR from 'swr';
import SingleColTable from '../../components/SingleColTable/SingleColTable';

let dietTableId = 0;
let cuisineTableId = 0;
const createDefaultSingleRow = (colName, rowName) => {
    if (colName === 'Diets') {
        dietTableId += 1;
        return {
            id: dietTableId,
            col: rowName
        };
    } else if (colName === 'Cuisines') {
        cuisineTableId += 1;
        return {
            id: cuisineTableId,
            col: rowName
        };
    }
};

function EditRecipe() {
    // Only difference from create-recipe is that edit-recipe should prefill data
    // by fetching existing recipe details from backend using current recipe ID.
    // Then, be able to update the recipe information using the current recipe ID and
    // hitting the backend endpoint.
    const navigate = useNavigate();
    const { recipeId } = useRecipeContext();
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });
    // array of ingredient objects
    const [ingredients, setIngredients] = useState([]);
    // for setting "# of Images Selected" next to upload images button
    const [imageName, setImageName] = useState('');
    // array of base64-encoded strings for storing images
    const [imagesEncoded, setImagesEncoded] = useState([]);
    // array of instruction objects
    const [instructions, setInstructions] = useState([]);

    // array of strings denoting diet names
    const [diets, setDiets] = React.useState([]);
    // default rows to display in diets table
    const [defaultDietRow, setDefaultDietRow] = React.useState([]);
    // array of strings denoting cuisine names
    const [cuisines, setCuisines] = React.useState([]);
    // default rows to display in cuisines table
    const [defaultCuisineRow, setDefaultCuisineRow] = React.useState([]);

    const [recipeName, setRecipeName] = React.useState('');
    const [cookingTime, setCookingTime] = React.useState(0);
    const [prepTime, setPrepTime] = React.useState(0);
    const [baseRecipe, setBaseRecipe] = React.useState('');

    const getRecipeDetailsUrl = `/recipes/edit-recipe/${recipeId}`;
    const fetcher = (url) => fetchBackend.get(url).then((res) => res.data);
    const { data, error } = useSWR(getRecipeDetailsUrl, fetcher);

    useEffect(() => {
        if (data) {
            // Set states from data.data
            // Assuming that data.data is the response data...
            setIngredients(data.data.ingredients);
            setImagesEncoded(data.data.recipeImages);
            setInstructions(data.data.instructions);
            // Assuming data.data.diets = [String] and data.data.cuisines = [String]
            setDefaultDietRow(
                data.data.diets.map((dietName) => createDefaultSingleRow('Diets', dietName))
            );
            setDefaultCuisineRow(
                data.data.cuisines.map((cuisineName) =>
                    createDefaultSingleRow('Cuisines', cuisineName)
                )
            );
            setRecipeName(data.data.recipeName);
            setCookingTime(data.data.cookingTime);
            setPrepTime(data.data.prepTime);
            setBaseRecipe(data.data.baseRecipe);
        }
    }, [data]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // get values for recipe creation
        const data = new FormData(event.currentTarget);
        // TODO: Get recipe name, cooking time, recipe images, ingredients, instructions
        const dataToSend = {
            recipeName: data.get('recipe-name'),
            cookingTime:
                data.get('cooking-time') !== ''
                    ? parseInt(data.get('cooking-time').toString())
                    : -1,
            prepTime:
                data.get('prep-time') !== '' ? parseInt(data.get('prep-time').toString()) : -1,
            baseRecipe: data.get('base-recipe'),
            recipeImages: imagesEncoded,
            ingredients: ingredients,
            instructions: instructions,
            cuisine: cuisines,
            diets: diets
        };

        console.log(dataToSend);

        fetchBackend
            .post('/recipes/create-recipe', dataToSend)
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
                                value={recipeName}
                                onChange={(event) => setRecipeName(event.target.value.toString())}
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
                                value={cookingTime === 0 ? undefined : cookingTime}
                                onChange={(event) =>
                                    setCookingTime(parseInt(event.target.value.toString()))
                                }
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
                                value={prepTime === 0 ? undefined : prepTime}
                                onChange={(event) =>
                                    setPrepTime(parseInt(event.target.value.toString()))
                                }
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
                                Submit Edited Recipe
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="base-recipe"
                                id="base-recipe"
                                label="Base Recipe"
                                sx={{ width: 500 }}
                                value={baseRecipe}
                                onChange={(event) => setBaseRecipe(event.target.value)}
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
                                        Related Diets/Cuisines
                                    </Typography>
                                    <Grid container direction="row" spacing={1.5}>
                                        <Grid item xs={6}>
                                            <SingleColTable
                                                colName="Diets"
                                                setRowVals={setDiets}
                                                rows={defaultDietRow}
                                                setRows={setDefaultDietRow}
                                                tableWidth={400}
                                                idCounter={dietTableId}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <SingleColTable
                                                colName="Cuisines"
                                                setRowVals={setCuisines}
                                                rows={defaultCuisineRow}
                                                setRows={setDefaultCuisineRow}
                                                tableWidth={400}
                                                idCounter={cuisineTableId}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default EditRecipe;
