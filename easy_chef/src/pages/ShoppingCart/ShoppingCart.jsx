import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useEffect, useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import { Grid, TextField, Box, TableFooter } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';

// // what this do?
// const theme = createTheme();

import CartIngredientTable from '../../components/CartIngredientTable/CartIngredientTable';
import CartRecipeTable from '../../components/CartRecipeTable/CartRecipeTable';
import { encodeImagesFromDb } from '../../Utils/encodeImages';

// function createIngredientData(name, unit, servings) {
//     return { name, unit, servings };
// }
//
// const ingredientRows = [
//     createIngredientData('Flour', '4 ½ cups', 3),
//     createIngredientData('Sugar', '1 ½ cups', 3),
//     createIngredientData('Salt', '1 ½ teaspoons', 3),
//     createIngredientData('Baking powder', '1 ½ teaspoons', 3),
//     createIngredientData('Baking soda', '1 ½ teaspoons', 3),
//     createIngredientData('Butter', '1 cup', 3),
//     createIngredientData('Eggs', '2', 3),
//     createIngredientData('Vanilla extract', '1 teaspoon', 3),
//     createIngredientData('Milk', '1 cup', 3),
//     createIngredientData('Chocolate chips', '1 cup', 3)
// ];

// const fetcher = (url) => fetchBackend.get(url).then((res) => res.data);
// const urlForGet = `/recipes/shopping-list/`; // where recipeId is the state from context
// const { data, error } = useSWR(urlForGet, fetcher);
//
// useEffect(() => {
//     if (data) {
//         // Do whatever with data.data... data.data should be the response body
//         // u can set states here to update states
//     }
// }, [data]);

// const [formError, setFormError] = useState({
//     errorOccurred: false,
//     errorMsg: ''
// });

function ShoppingCart() {
    const navigate = useNavigate();
    const [recipeRows, setRecipeRows] = useState([]);
    const [ingredientRows, setIngredientRows] = useState([]);
    const [changed, setChanged] = useState(false);
    useEffect(() => {
        fetchBackend
            .get(`/recipes/shopping-list/`)
            .then(async (res) => {
                const formattedRecipesPromises = res.data['recipes'].map(async (recipe) => {
                    const recipeFormatted = {
                        id: recipe.id,
                        recipeName: recipe.name,
                        servings: recipe.servings,
                        ingredients: recipe.ingredients.map(
                            (ingredient) =>
                                ingredient.name +
                                ' ' +
                                ingredient.quantity +
                                ' ' +
                                ingredient.unit_of_measure
                        ),
                        image: ''
                    };
                    try {
                        const imageResponse = await fetchBackend.get(
                            `/recipes/${recipe.id}/retrieve-recipe-files`
                        );
                        if (imageResponse.data.files.length !== 0) {
                            console.log(`Successfully retrieved recipe image for ${recipe.id}`);
                            recipeFormatted.image = await encodeImagesFromDb(
                                imageResponse.data.files
                            );
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    return recipeFormatted;
                });

                const formattedRecipes = await Promise.all(formattedRecipesPromises);
                const formattedIngredients = res.data['ingredients'].map((ingredient) => ({
                    id: ingredient.id,
                    name: ingredient.name,
                    quantity: ingredient.amount,
                    unit: ingredient.unit_of_measure
                }));
                setRecipeRows(formattedRecipes);
                setIngredientRows(formattedIngredients);
                setChanged(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [changed]);

    return (
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
            <Grid item xs={6}>
                <CartRecipeTable
                    rows={recipeRows}
                    setRows={setRecipeRows}
                    setChangeMade={setChanged}
                />
            </Grid>
            <Grid item xs={5}>
                <CartIngredientTable rows={ingredientRows} setRows={setIngredientRows} />
            </Grid>
        </Grid>
    );
}

export default ShoppingCart;
