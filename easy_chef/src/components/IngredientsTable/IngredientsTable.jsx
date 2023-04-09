import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';

let idCounter = 0;
const createRow = () => {
    idCounter += 1;
    return {
        id: idCounter,
        ingredientName: '',
        ingredientAmount: 0
    };
};

const measurements = [
    'Grams',
    'Kilograms',
    'Milliliters',
    'Liters',
    'Teaspoon',
    'Cup',
    'Ounce',
    'Pound',
    'Pinch',
    'Unit'
];

function handleFileUpload(event, id) {}

function IngredientsTable() {
    const columns = [
        { field: 'ingredientName', headerName: 'Name', width: 200, editable: true },
        {
            field: 'ingredientImage',
            headerName: 'Image',
            width: 260,
            editable: true,
            renderCell: (params) => (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload(event, params.id)}
                />
            )
        },
        {
            field: 'ingredientAmount',
            headerName: 'Amount',
            type: 'number',
            width: 130,
            editable: true
        },
        {
            field: 'ingredientMeasurement',
            headerName: 'Measure',
            width: 90,
            editable: true,
            type: 'singleSelect',
            valueOptions: measurements
        }
    ];

    const [rows, setRows] = React.useState(() => []);

    const handleAddRow = () => {
        setRows((prevState) => [...prevState, createRow()]);
    };

    return (
        <div style={{ height: 400, width: '75%', marginBottom: 40 }}>
            <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleAddRow}>
                    Add a row
                </Button>
            </Stack>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
}

export default IngredientsTable;
