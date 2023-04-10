import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import { Grid, TextField, Box } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import IngredientsTable from '../../components/IngredientsTable/IngredientsTable';
import AddInstructionsComponent from '../../components/AddInstructionsComponent/AddInstructionsComponent';
import Button from '@mui/material/Button';
import { CreateRecipeIngredientsContext } from '../../contexts/CreateRecipeIngredientsContext/CreateRecipeIngredientsContext';

function CreateRecipe() {
    const navigate = useNavigate();
    const { setRecipeId } = useRecipeContext();
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });
    const [ingredients, setIngredients] = useState([]);

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

    const [imageName, setImageName] = useState('');
    const handleImage = (event) => {
        const files = Array.from(event.target.files);
        const [file] = files;
        setImageName(file.name);
    };

    return (
        <Grid container spacing={2} sx={{ textAlign: 'start' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
            <Grid item xs={12} sx={{ ml: 6, mt: 6 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField id="recipe-name" label="Recipe Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="cooking-time" label="Cooking Time" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <CreateRecipeIngredientsContext.Provider
                                value={{ ingredients, setIngredients }}
                            >
                                <IngredientsTable />
                            </CreateRecipeIngredientsContext.Provider>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" component="label">
                                Upload Recipe Image
                                <input type="file" accept="image/" hidden onChange={handleImage} />
                            </Button>
                            <TextField
                                sx={{ ml: 2 }}
                                InputProps={{ disableUnderline: true }}
                                variant="standard"
                                value={imageName}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <AddInstructionsComponent />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CreateRecipe;
