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
import fetchBackend from '../../Utils/fetchBackend';

function CartRecipeTable(props) {
    // const handleServingsChange = (id, newServings) => {
    //     const newRows = props.rows.map((row) => {
    //         if (row.id === id) {
    //             return {
    //                 ...row,
    //                 servings: newServings
    //             };
    //         }
    //         return row;
    //     });
    //     props.setRows(newRows);
    // };
    const [deletedRows, setDeletedRows] = useState([]);

    const handleClick = (id) => {
        props.setRows((rows) => rows.filter((row) => row.id !== id));
        setDeletedRows([...deletedRows, id]);
    };

    useEffect(() => {
        if (deletedRows.length > 0) {
            const remainingRows = [];
            deletedRows.forEach((id) => {
                fetchBackend
                    .post(`/recipes/${id}/remove-from-cart/`)
                    .then((res) => {
                        if (res.status === 204) {
                            console.log(
                                `Recipe with ID ${id} has been successfully removed from cart.`
                            );
                        } else {
                            remainingRows.push(id);
                        }
                    })
                    .catch((error) => {
                        console.log(`Failed to remove recipe with ID ${id} from cart: ${error}`);
                        remainingRows.push(id);
                    });
            });
            setDeletedRows(remainingRows);
        }
    }, [deletedRows]);

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
            field: 'servings',
            headerName: 'Servings',
            type: 'number',
            width: 160,
            renderCell: (params) => {
                return <GroupedButtons servings={params.value} />;
            },
            editable: false
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            renderCell: (params) => {
                // const handleClick = () => {
                //     props.setRows((rows) => rows.filter((row) => row.id !== params.row.id));
                //     //  send post request to backend http://127.0.0.1:8000/recipes/1/remove-from-cart/ to remove recipe from cart
                //     useEffect(() => {
                //         fetchBackend
                //             .post(`/recipes/${params.row.id}/remove-from-cart/`)
                //             .then((res) => {
                //                 console.log(res);
                //             })
                //             .catch((error) => {
                //                 console.log(error);
                //             });
                //     }, []);
                // };
                return (
                    <ClickableChip onClick={() => handleClick(params.row.id)}>Delete</ClickableChip>
                );
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
