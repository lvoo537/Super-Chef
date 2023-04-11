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
    const [total, setTotal] = useState(0);
    const [maxServings, setMaxServings] = useState(0);

    // Call backend to get array of recipeIds of shopping cart.
    // For each recipeId, call backend to get recipe information.
    // [...] -> attributes
    // [...] -> api call -> [...] -> attributes
    // [ { recipeName: String, servings: number, prices: number, unit: string }, ... ]

    useEffect(() => {
        // calculate the total of prices
        let newTotal = props.rows.reduce(
            (acc, curr) => acc + Number(curr.price.replace('$', '')),
            0
        );
        newTotal = '$' + newTotal.toFixed(2).toString();
        setTotal(newTotal);
    }, [props.rows]);

    useEffect(() => {
        // calculate the max servings

        const newMaxServings = props.rows.reduce((acc, curr) => Math.max(acc, curr.servings), 0);
        setMaxServings(newMaxServings);
    }, [props.rows]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>INGREDIENT NAMES</TableCell>
                        <TableCell align="left"> UNITS </TableCell>
                        <TableCell align="center">SERVINGS</TableCell>
                        <TableCell align="center">PRICES</TableCell>
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
                            <TableCell align="left">{row.unit}</TableCell>
                            <TableCell align="center">{row.servings}</TableCell>
                            <TableCell align="center">{row.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell align="center">{maxServings}</TableCell>
                        <TableCell align="center">{total}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

export default CartIngredientTable;
