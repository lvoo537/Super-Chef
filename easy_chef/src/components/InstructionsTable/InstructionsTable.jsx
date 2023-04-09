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

export default function InstructionsTable() {
    // TODO: Use Accordion of MUI

    const [rowNum, setRowNum] = React.useState(2);

    const [instructionValues, setInstructionValues] = React.useState([]);

    const rowTemplate = (num) => {
        return (
            <StyledTableRow key={`row-${num}`}>
                <StyledTableCell component="th" scope="row">
                    {num}
                </StyledTableCell>
                <StyledTableCell>
                    <TextField
                        id="add-instruction-body"
                        label="Instructions"
                        multiline
                        rows={8}
                        placeholder="Write something here..."
                        value={instructionValues[num]}
                        onChange={(event) => {
                            setInstructionValues(event.target.value);
                        }}
                    />
                </StyledTableCell>
                <StyledTableCell>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input type="file" hidden />
                    </Button>
                </StyledTableCell>
            </StyledTableRow>
        );
    };

    const [rows, setRows] = React.useState([rowTemplate(1)]);

    return (
        <Box>
            <Table
                sx={{ width: 900, margin: 'auto', marginLeft: 0 }}
                aria-label="ingredients table"
            >
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Instruction #</StyledTableCell>
                        <StyledTableCell>Instruction</StyledTableCell>
                        <StyledTableCell>Image</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{rows.map((row) => row)}</TableBody>
            </Table>
            <Button
                variant="contained"
                onClick={() => {
                    setRowNum((prevState) => prevState + 1);
                    setRows((prevState) => [...prevState, rowTemplate(rowNum)]);
                }}
                sx={{ mt: 2 }}
            >
                Add Row
            </Button>
        </Box>
    );
}
