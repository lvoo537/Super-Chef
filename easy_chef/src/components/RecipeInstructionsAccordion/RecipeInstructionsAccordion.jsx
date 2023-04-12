import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Carousel from '../Carousel/Carousel';
import Paper from '@mui/material/Paper';
import * as React from 'react';

/**
 * Given instructions prop, return a column-styled accordion of instructions
 * @param props - requires instructions prop... instructions prop is an array of JSON objects of
 * the form { instructionName: String, instructionBody: String, instructionImages: [String] }
 * where instructionImages is an array of base64 encoded image strings.
 * @returns {JSX.Element} Accordion for recipe instructions
 */
export default function RecipeInstructionsAccordion(props) {
    return (
        <div style={{ marginTop: 4 }}>
            {props.instructions.map((instruction, index) => (
                <Paper
                    elevation={4}
                    sx={{ width: 750, maxWidth: 750, marginTop: 3, marginBottom: 4 }}
                    key={index}
                >
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{`${index + 1}. ${
                                instruction.instructionName
                            }`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ mb: 3 }}>{instruction.instructionBody}</Typography>
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
    );
}
