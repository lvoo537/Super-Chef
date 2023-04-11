import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import Carousel from '../Carousel/Carousel';
import Box from '@mui/material/Box';

export default function AddInstructionsComponent({ instructions, setInstructions }) {
    const [instructionName, setInstructionName] = useState('');
    const [instructionBody, setInstructionBody] = useState('');
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const handleImages = (event) => {
        const files = Array.from(event.target.files);
        const numSelected = `${files.length} Files Selected`;
        setImageName(numSelected);

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
            instructionName,
            instructionBody,
            instructionImages: imagesEncoded
        };
        setInstructions((prevState) => [...prevState, newInstruction]);

        // Reset values for next instruction
        setInstructionName('');
        setInstructionBody('');
        setImageName('');
        setImagesEncoded([]);
    };

    return (
        <div style={{ textAlign: 'start' }}>
            <div style={{ marginTop: 4 }}>
                {instructions.map((instruction, index) => (
                    <Paper
                        elevation={4}
                        sx={{ width: 750, maxWidth: 750, marginTop: 3, marginBottom: 4 }}
                        key={index}
                    >
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{instruction.instructionName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{instruction.instructionBody}</Typography>
                                {instruction.instructionImages.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Carousel images={instruction.instructionImages} />
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                ))}
            </div>
            <Paper elevation={4} sx={{ width: 750, maxWidth: 750, marginBottom: 5 }}>
                <Grid container spacing={4} margin="auto" marginLeft={3}>
                    <Grid item xs={12} marginTop={2}>
                        <TextField
                            id="instruction-name"
                            label="Instruction Name"
                            variant="outlined"
                            value={instructionName}
                            onChange={(e) => setInstructionName(e.target.value)}
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
