import { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { TableFooter } from '@mui/material';
import * as React from 'react';

function CartIngredientTable(props) {
    // const [maxServings, setMaxServings] = useState(0);

    // Call backend to get array of recipeIds of shopping cart.
    // For each recipeId, call backend to get recipe information.
    // [...] -> attributes
    // [...] -> api call -> [...] -> attributes
    // [ { recipeName: String, servings: number, prices: number, unit: string }, ... ]

    // useEffect(() => {
    //     // calculate the max servings
    //
    //     const newMaxServings = props.rows.reduce((acc, curr) => Math.max(acc, curr.servings), 0);
    //     setMaxServings(newMaxServings);
    // }, [props.rows]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>INGREDIENT NAMES</TableCell>
                        <TableCell align="left"> Qty </TableCell>
                        <TableCell align="center">UNITS</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="left">{row.quantity}</TableCell>
                            <TableCell align="center">{row.unit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CartIngredientTable;
