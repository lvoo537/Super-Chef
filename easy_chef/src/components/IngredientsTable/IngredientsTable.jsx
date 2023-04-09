import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const measurements = ['mg', 'g', 'kg', 'lbs'];

export default function IngredientsTable() {
    const [addIngredient, setAddIngredient] = React.useState({
        ingredientName: '',
        image: '',
        amount: 0
    });

    const [measurement, setMeasurement] = React.useState('');
    const handleMeasurementChange = (event) => {
        setMeasurement(event.target.value);
    };

    const [rowNum, setRowNum] = React.useState(1);

    const rowTemplate = (num) => {
        return (
            <StyledTableRow key={`row-${num}`}>
                <StyledTableCell component="th" scope="row">
                    <TextField
                        id="add-ingredient-name"
                        label="Ingredient Name"
                        variant="standard"
                    />
                </StyledTableCell>
                <StyledTableCell>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input type="file" hidden />
                    </Button>
                </StyledTableCell>
                <StyledTableCell>
                    <TextField
                        id="add-ingredient-amount"
                        label="Ingredient Amount"
                        variant="standard"
                        type="number"
                    />
                </StyledTableCell>
                <StyledTableCell>
                    <FormControl fullWidth>
                        <InputLabel id="measurements-label">Measure</InputLabel>
                        <Select
                            id="measurements"
                            labelId="measurements-label"
                            value={measurement}
                            onChange={handleMeasurementChange}
                            label="Measure"
                            input={<OutlinedInput label="Measurements" />}
                        >
                            {measurements.map((measure) => (
                                <MenuItem key={measure} value={measure}>
                                    {measure}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </StyledTableCell>
            </StyledTableRow>
        );
    };

    const [rows, setRows] = React.useState([rowTemplate(0)]);

    return (
        <Box>
            <Table
                sx={{ width: 900, margin: 'auto', marginLeft: 0 }}
                aria-label="ingredients table"
            >
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Ingredient Name</StyledTableCell>
                        <StyledTableCell>Image</StyledTableCell>
                        <StyledTableCell>Amount</StyledTableCell>
                        <StyledTableCell>Measurement</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{rows.map((row) => row)}</TableBody>
            </Table>
            <Button
                variant="contained"
                onClick={() => {
                    setRowNum((prevState) => prevState + 1);
                    console.log(rowNum);
                    setRows((prevState) => [...prevState, rowTemplate(rowNum)]);
                }}
                sx={{ mt: 2 }}
            >
                Add Row
            </Button>
        </Box>
    );
}
