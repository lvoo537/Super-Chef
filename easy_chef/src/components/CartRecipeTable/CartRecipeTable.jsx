import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './CartRecipeTable.css';
import VirtualizedList from './MultipleSelectNative/MultipleSelectNative';
import GroupedButtons from './GroupedButtons/GroupedButtons';

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
                return <VirtualizedList ingredients={params.row.ingredients} itemSize={44} />;
            },
            width: 170,
            editable: false
        },
        {
            field: 'servingQuantity',
            headerName: 'Servings',
            type: 'number',
            width: 200,
            renderCell: (params) => {
                return <GroupedButtons> </GroupedButtons>;
            },
            editable: false
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
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
