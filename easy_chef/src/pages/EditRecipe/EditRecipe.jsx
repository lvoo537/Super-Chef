import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useEffect, useState } from 'react';
import * as React from 'react';
import fetchBackend, { fetchBackendImg } from '../../Utils/fetchBackend';
import encodeImages, { encodeImagesFromDb } from '../../Utils/encodeImages';
import { Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';
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
    const { recipeIdPath } = useParams();
    const navigate = useNavigate();
    const { recipeId, fromCard } = useRecipeContext();
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
    const [instrImagesEncoded, setInstrImagesEncoded] = useState([]);
    const [instrImagesLoaded, setInstrImagesLoaded] = useState(false);

    // array of strings denoting diet names
    const [diets, setDiets] = React.useState([]);
    // default rows to display in diets table
    const [defaultDietRow, setDefaultDietRow] = React.useState([]);
    // array of strings denoting cuisine names
    const [cuisines, setCuisines] = React.useState([]);
    // default rows to display in cuisines table
    const [defaultCuisineRow, setDefaultCuisineRow] = React.useState([]);

    const [recipeName, setRecipeName] = React.useState('');
    const [cookingTime, setCookingTime] = React.useState(undefined);
    const [prepTime, setPrepTime] = React.useState(undefined);
    const [owner, setOwner] = React.useState('');
    // const [baseRecipe, setBaseRecipe] = React.useState('');

    const getRecipeDetailsUrl = `http://localhost:8000/recipes/recipe-details/${
        fromCard ? recipeId : recipeIdPath
    }/`;
    const fetcher = (url) => fetchBackend.get(url).then((res) => res.data);
    const { data, error } = useSWR(getRecipeDetailsUrl, fetcher);

    function timeStringToMintutes(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return parseInt(hours * 60 + minutes + seconds / 60);
    }

    let ingredientIdCounter = 0;
    useEffect(() => {
        if (data) {
            console.log(data);
            setIngredients(
                data.ingredients.map((ingredient, index) => {
                    ingredientIdCounter += 1;
                    return {
                        id: `id-from-db-${ingredientIdCounter}`,
                        name: ingredient.name,
                        quantity: parseInt(ingredient.quantity),
                        unit_of_measure: ingredient.unit_of_measure
                    };
                })
            );
            fetchBackend
                .get(`/recipes/${data.id}/retrieve-recipe-files`)
                .then(async (res) => {
                    // console.log(res.data);
                    console.log('Successfully retrieved recipe images');
                    const encodedImages = await encodeImagesFromDb(res.data.files);
                    setImagesEncoded(encodedImages);
                })
                .catch((err) => {
                    console.log(err);
                });
            const instructionsResponse = data.instructions;

            if (instructionsResponse.length === 0) setInstrImagesLoaded(true);

            Promise.all(
                instructionsResponse.map(async (instr) => {
                    try {
                        const res = await fetchBackend.get(
                            `/recipes/${instr.id}/retrieve-instruction-files`
                        );
                        const encodedImages = await encodeImagesFromDb(res.data.files);
                        instr.instructionImagesEncoded = encodedImages;
                        return encodedImages;
                    } catch (err) {
                        console.log(err);
                        return [];
                    }
                })
            ).then((encodedImagesArray) => {
                const imagesEncoded = encodedImagesArray.flat();
                setInstructions(instructionsResponse);
                setInstrImagesEncoded(imagesEncoded);
                console.log(instructions);
                setInstrImagesLoaded(true);
            });

            setDefaultDietRow(data.diets.map((diet) => createDefaultSingleRow('Diets', diet.name)));
            setDefaultCuisineRow(
                data.cuisines.map((cuisine) => createDefaultSingleRow('Cuisines', cuisine.name))
            );
            setRecipeName(data.name);
            setCookingTime(timeStringToMintutes(data.cooking_time));
            setPrepTime(timeStringToMintutes(data.prep_time));
            setOwner(data.owner);
            // const baseRecipeId = data.base_recipe === null ? '' : data.base_recipe;
            // if (baseRecipeId === '') setBaseRecipe('');
            // fetchBackend
            //     .get(`/recipes/recipe-details/${baseRecipeId}`)
            //     .then((res) => {
            //         console.log('Successfully retrieved base recipe details');
            //         setBaseRecipe(res.data.name);
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });
        }
    }, [data, instrImagesLoaded, setInstrImagesLoaded]);

    if (error && error.status === 404) {
        return (
            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={12}>
                    <Navbar></Navbar>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <Typography variant="h5">Recipe Not Found</Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    } else if (error) {
        return (
            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={12}>
                    <Navbar></Navbar>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h5">Failed to get recipe details...</Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // get values for recipe creation
        const data = new FormData(event.currentTarget);
        // TODO: Get recipe name, cooking time, recipe images, ingredients, instructions
        const dataToSend = {
            name: data.get('recipe-name'),
            // base_recipe: data.get('base-recipe'),
            ingredients: ingredients,
            cuisine: cuisines,
            diets: diets,
            owner
        };
        const instrReq = [];
        for (let instr of instructions) {
            instrReq.push({
                cooking_time: instr.cooking_time,
                instruction: instr.instruction,
                prep_time: instr.prep_time,
                step_number: instr.step_number
            });
        }
        dataToSend.instructions = instrReq;
        if (cookingTime !== '') {
            dataToSend.cooking_time = cookingTime;
        }
        if (prepTime !== '') {
            dataToSend.prep_time = prepTime;
        }

        fetchBackend
            .post(`/recipes/${fromCard ? recipeId : recipeIdPath}/update-recipe/`, dataToSend)
            .then((response) => {
                console.log('Successfully edited recipe');
                fetchBackend
                    .get(`/recipes/recipe-details/${fromCard ? recipeId : recipeIdPath}/`)
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
                                    fetchBackendImg
                                        .post(`/recipes/${instr.id}/upload-instruction/`, formData)
                                        .then((response) => {
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
        encodeImages(event, setImageName, setImagesEncoded);
    };

    if (!instrImagesLoaded) {
        return (
            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={12}>
                    <Navbar></Navbar>
                </Grid>
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
            </Grid>
        );
    }

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
                                focused
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
                                focused
                                error={formError.errorOccurred}
                                helperText={formError.errorMsg}
                                InputProps={{ inputProps: { min: 0 } }}
                                value={cookingTime}
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
                                focused
                                error={formError.errorOccurred}
                                helperText={formError.errorMsg}
                                InputProps={{ inputProps: { min: 0 } }}
                                value={prepTime}
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
                                Submit Edited Recipe
                            </Button>
                        </Grid>
                        {/*<Grid item xs={12}>*/}
                        {/*    <TextField*/}
                        {/*        name="base-recipe"*/}
                        {/*        id="base-recipe"*/}
                        {/*        label="Base Recipe"*/}
                        {/*        sx={{ width: 500 }}*/}
                        {/*        value={baseRecipe}*/}
                        {/*        onChange={(event) => setBaseRecipe(event.target.value)}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
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
