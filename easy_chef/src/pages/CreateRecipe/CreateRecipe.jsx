import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext/RecipeContext';
import { useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';
import encodeImages from '../../Utils/encodeImages';
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
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);

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
                        spacing={1}
                        margin="auto"
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item xs={4}>
                            <TextField id="recipe-name" label="Recipe Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="cooking-time" label="Cooking Time" variant="outlined" />
                        </Grid>
                        <Grid item xs={4} marginTop={1} marginLeft={23.8}>
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
                            <TextField
                                sx={{ ml: 2 }}
                                InputProps={{ disableUnderline: true }}
                                variant="standard"
                                value={imageName}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} marginLeft={2}>
                            <CreateRecipeIngredientsContext.Provider
                                value={{ ingredients, setIngredients }}
                            >
                                <IngredientsTable width={750} />
                            </CreateRecipeIngredientsContext.Provider>
                        </Grid>
                        <Grid item xs={12} marginLeft={2}>
                            <AddInstructionsComponent />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CreateRecipe;
