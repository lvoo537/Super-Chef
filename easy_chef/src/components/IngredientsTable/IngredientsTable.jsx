import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

export default function IngredientsTable() {
    const [rows, setRows] = React.useState([
        {
            ingredientName: 'Ingredient 1',
            image: '',
            amount: 0
        }
    ]);

    // TODO: Implement a button near end of table to add one more row
    //       Then, setRows to the new array of rows
    return (
        <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 500 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Ingredient Name</StyledTableCell>
                        <StyledTableCell align="right">Image</StyledTableCell>
                        <StyledTableCell align="right">Amount</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                {row.ingredientName}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.image}</StyledTableCell>
                            <StyledTableCell align="right">{row.amount}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
