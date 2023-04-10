import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import { Grid, TextField, Box } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import * as React from 'react';
import { createTheme } from '@mui/material/styles';
// import IngredientsTable from '../../components/IngredientsTable/IngredientsTable';
// import InstructionsTable from '../../components/InstructionsTable/InstructionsTable';
// import Button from '@mui/material/Button';
const theme = createTheme();

function ShoppingCart() {
    return (
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
        </Grid>
    );
}

export default ShoppingCart;
