import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend, { fetchBackendImg } from '../../Utils/fetchBackend';
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
    const { recipeId, setRecipeId } = useRecipeContext();
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });
    const [ingredients, setIngredients] = useState([]);
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [recipeImages, setRecipeImages] = useState([]);
    const [instructions, setInstructions] = useState([]);

    const [prepTime, setPrepTime] = useState(undefined);
    const [cookingTime, setCookingTime] = useState(undefined);
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
                data.get('cooking-time') !== '' ? parseInt(data.get('cooking-time').toString()) : 0,
            prep_time:
                data.get('prep-time') !== '' ? parseInt(data.get('prep-time').toString()) : 0,
            base_recipe: data.get('base-recipe'),
            ingredients: ingredients,
            instructions: instructions.map((instr) => {
                return {
                    instruction: instr.instruction,
                    step_number: instr.step_number,
                    cooking_time: instr.cooking_time,
                    prep_time: instr.prep_time
                };
            }),
            cuisine: cuisines,
            diets: diets
        };

        console.log(dataToSend);

        fetchBackend
            .post('/recipes/create/', dataToSend)
            .then((response) => {
                console.log('Successfully created recipe');
                const recipeIdResponse = response.data.recipe_id;
                setRecipeId(recipeIdResponse);

                const formDataRecipeImg = new FormData();
                if (recipeImages.length !== 0) {
                    recipeImages.map((img, index) => {
                        formDataRecipeImg.append('file' + index, img);
                    });
                }
                fetchBackendImg
                    .post(`/recipes/${recipeIdResponse}/upload-recipe/`, formDataRecipeImg)
                    .then((response) => {
                        console.log(response);
                        console.log('Successfully uploaded recipe images');
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                fetchBackend
                    .get(`/recipes/recipe-details/${recipeIdResponse}/`)
                    .then((response) => {
                        console.log('Successfully retrieved recipe details');
                        const detailsInstructions = response.data.instructions;
                        for (let instr of detailsInstructions) {
                            for (let instruction of instructions) {
                                if (instruction.step_number === instr.step_number) {
                                    const formData = new FormData();
                                    if (instruction.instructionImages) {
                                        instruction.instructionImages.map((image, index) => {
                                            formData.append('file' + index, image);
                                        });
                                    }
                                    console.log(formData);
                                    fetchBackendImg
                                        .post(`/recipes/${instr.id}/upload-instruction/`, formData)
                                        .then((response) => {
                                            console.log(response);
                                            console.log(
                                                `Successfully uploaded instruction id: ${instr.id}`
                                            );
                                            navigate('/');
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                    break;
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleImages = (event) => {
        const files = Array.from(event.target.files);
        setRecipeImages(files);
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
                                required
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                name="cooking-time"
                                id="cooking-time"
                                label="Cooking Time"
                                variant="outlined"
                                type="number"
                                value={cookingTime}
                                InputProps={{ inputProps: { min: 0 } }}
                                error={formError.errorOccurred}
                                helperText={formError.errorMsg}
                                onChange={(event) => {
                                    const inputVal = parseInt(event.target.value, 10);
                                    const maxCookingTime = 24 * 60;

                                    if (
                                        !isNaN(inputVal) &&
                                        inputVal >= 0 &&
                                        inputVal <= maxCookingTime
                                    ) {
                                        setCookingTime(inputVal);
                                        setFormError({
                                            errorOccurred: false,
                                            errorMsg: ''
                                        });
                                    } else {
                                        setFormError({
                                            errorOccurred: true,
                                            errorMsg: `Time must be between 0 and ${maxCookingTime}`
                                        });
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                name="prep-time"
                                id="prep-time"
                                label="Prep Time"
                                variant="outlined"
                                type="number"
                                value={prepTime}
                                InputProps={{ inputProps: { min: 0 } }}
                                error={formError.errorOccurred}
                                helperText={formError.errorMsg}
                                onChange={(event) => {
                                    const inputVal = parseInt(event.target.value, 10);
                                    const maxPrepTime = 24 * 60;

                                    if (
                                        !isNaN(inputVal) &&
                                        inputVal >= 0 &&
                                        inputVal <= maxPrepTime
                                    ) {
                                        setPrepTime(inputVal);
                                        setFormError({
                                            errorOccurred: false,
                                            errorMsg: ''
                                        });
                                    } else {
                                        setFormError({
                                            errorOccurred: true,
                                            errorMsg: `Time must be between 0 and ${maxPrepTime}`
                                        });
                                    }
                                }}
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
