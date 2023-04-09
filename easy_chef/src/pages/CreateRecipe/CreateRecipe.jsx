import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import { Grid, TextField, Box } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import IngredientsTable from '../../components/IngredientsTable/IngredientsTable';

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
            <Grid item xs={12}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <TextField id="recipe-name" label="Recipe Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="cooking-time" label="Cooking Time" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <IngredientsTable />
                        </Grid>
                        <Grid item xs={6}>
                            <div></div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CreateRecipe;
