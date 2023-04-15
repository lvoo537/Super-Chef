import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import RecipeInstructionsAccordion from '../RecipeInstructionsAccordion/RecipeInstructionsAccordion';
import { Typography } from '@mui/material';

export default function AddInstructionsComponent({ instructions, setInstructions }) {
    const [instructionBody, setInstructionBody] = useState('');
    const [instructionNum, setInstructionNum] = useState(1);
    const [cookingTime, setCookingTime] = useState(0);
    const [prepTime, setPrepTime] = useState(0);
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [rawImages, setRawImages] = useState([]);
    const handleImages = (event) => {
        const files = Array.from(event.target.files);
        const numSelected = `${files.length} Files Selected`;
        setImageName(numSelected);
        setRawImages(files);

        for (let file of files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagesEncoded((prevState) => [...prevState, base64String]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddInstruction = () => {
        const newInstruction = {
            instruction: instructionBody,
            step_number: instructionNum,
            cooking_time: cookingTime,
            prep_time: prepTime,
            instructionImagesEncoded: imagesEncoded,
            instructionImages: rawImages
        };
        setInstructions((prevState) => [...prevState, newInstruction]);
        setInstructionNum((prevState) => prevState + 1);

        // Reset values for next instruction
        setInstructionBody('');
        setImageName('');
        setCookingTime(1);
        setPrepTime(1);
        setImagesEncoded([]);
    };

    return (
        <div style={{ textAlign: 'start' }}>
            <RecipeInstructionsAccordion instructions={instructions} />
            <Paper elevation={4} sx={{ width: 750, maxWidth: 750, marginBottom: 5 }}>
                <Grid container spacing={4} margin="auto" marginLeft={3}>
                    <Grid item xs={12} marginTop={2}>
                        <Typography variant="h6">Instruction #{instructionNum}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="cooking-time"
                            label="Cooking Time"
                            variant="outlined"
                            value={cookingTime}
                            onChange={(e) => setCookingTime(parseInt(e.target.value))}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="prep-time"
                            label="Preparation Time"
                            variant="outlined"
                            value={prepTime}
                            onChange={(e) => setPrepTime(parseInt(e.target.value))}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="instruction-box"
                            label="Instruction Body"
                            variant="outlined"
                            multiline
                            rows={8}
                            sx={{ width: 650 }}
                            value={instructionBody}
                            onChange={(e) => setInstructionBody(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" component="label">
                            Upload Images
                            <input
                                type="file"
                                accept="image/"
                                hidden
                                onChange={handleImages}
                                multiple
                            />
                        </Button>
                        <TextField
                            sx={{ ml: 2, mt: 0.3 }}
                            InputProps={{ disableUnderline: true }}
                            variant="standard"
                            value={imageName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" size="large" onClick={handleAddInstruction}>
                            Add Instruction
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
