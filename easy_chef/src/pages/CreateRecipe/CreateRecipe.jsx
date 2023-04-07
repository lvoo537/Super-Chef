import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import { Grid } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';

function CreateRecipe() {
    const navigate = useNavigate();
    const { setRecipeId } = useRecipeContext();
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // get values for recipe creation
        const data = new FormData(event.currentTarget);
        const dataToSend = {};

        fetchBackend
            .post('/recipes/create-recipe', dataToSend)
            .then((response) => {})
            .catch((error) => {});
    };
    return (
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
        </Grid>
    );
}

export default CreateRecipe;
