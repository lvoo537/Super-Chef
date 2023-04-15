import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './CartRecipeTable.css';
import VirtualizedList from './MultipleSelectNative/MultipleSelectNative';
import GroupedButtons from './GroupedButtons/GroupedButtons';
import { List } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ClickableChip from './ClickableChip/ClickableChip';

function CartRecipeTable(props) {
    const columns = [
        // { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'image',
            width: 150,
            headerName: 'Images',
            editable: false
        },
        {
            field: 'recipeName',
            headerName: 'Recipes',
            width: 150,
            editable: false
        },
        {
            field: 'ingredients',
            headerName: 'Ingredients',
            renderCell: (params) => {
                // console.log(params.row.ingredients);
                return (
                    <Paper style={{ maxHeight: 115, overflowY: 'scroll', whiteSpace: 'pre-wrap' }}>
                        <List>
                            {params.row.ingredients.map((ingredient, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={ingredient} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                );
            },
            width: 170,
            editable: false
        },
        {
            field: 'servingQuantity',
            headerName: 'Servings',
            type: 'number',
            width: 160,
            renderCell: (params) => {
                return <GroupedButtons> </GroupedButtons>;
            },
            editable: false
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            renderCell: (params) => {
                return <ClickableChip> </ClickableChip>;
            },
            width: 200
        }
    ];

    return (
        <Box sx={{ height: 800, width: '100%' }}>
            <DataGrid
                rows={props.rows}
                columns={columns}
                rowHeight={120}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5
                        }
                    }
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}

export default CartRecipeTable;
