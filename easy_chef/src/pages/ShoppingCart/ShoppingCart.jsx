import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useEffect, useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import { Grid, TextField, Box, TableFooter } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';

import { createTheme } from '@mui/material/styles';

// // what this do?
// const theme = createTheme();

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CartIngredientTable from '../../components/CartIngredientTable/CartIngredientTable';
import CartRecipeTable from '../../components/CartRecipeTable/CartRecipeTable';

function createIngredientData(name, unit, servings, price) {
    return { name, unit, servings, price };
}

const ingredientRows = [
    createIngredientData('Flour', '4 ½ cups', 3, '$10'),
    createIngredientData('Sugar', '1 ½ cups', 3, '$10'),
    createIngredientData('Salt', '1 ½ teaspoons', 3, '$10'),
    createIngredientData('Baking powder', '1 ½ teaspoons', 3, '$10'),
    createIngredientData('Baking soda', '1 ½ teaspoons', 3, '$10'),
    createIngredientData('Butter', '1 cup', 3, '$10'),
    createIngredientData('Eggs', '2', 3, '$10'),
    createIngredientData('Vanilla extract', '1 teaspoon', 3, '$10'),
    createIngredientData('Milk', '1 cup', 3, '$10'),
    createIngredientData('Chocolate chips', '1 cup', 3, '$10')
];

const recipeRows = [
    {
        id: 1,
        recipeName: 'Chocolate Brownie',
        ingredients: [
            'Flour',
            'Sugar',
            'Salt',
            'Baking powder',
            'Baking soda',
            'Butter',
            'Eggs',
            'Vanilla extract',
            'Milk',
            'Chocolate chips'
        ]
    }
    // { id: 2, recipeName: 'Chocolate Brownie', ingredients: 'Snow' }
];

function ShoppingCart() {
    const navigate = useNavigate();

    return (
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
            <Grid item xs={6}>
                <CartRecipeTable rows={recipeRows} />
            </Grid>
            <Grid item xs={5}>
                <CartIngredientTable rows={ingredientRows} />
            </Grid>
        </Grid>
    );
}

export default ShoppingCart;
