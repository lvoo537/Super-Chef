import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import {
    CreateRecipeIngredientsContext,
    useCreateIngredientsContext
} from '../../contexts/CreateRecipeIngredientsContext/CreateRecipeIngredientsContext';

// For setting ID of row
let idCounter = 0;
/**
 * Create a new row (with default values)
 * @returns {{ingredientName: string, ingredientAmount: number, id: number}}
 */
const createRow = () => {
    idCounter += 1;
    return {
        id: idCounter,
        ingredientName: '',
        ingredientImage: '',
        ingredientAmount: 0,
        ingredientMeasurement: measurements[0]
    };
};

// Measurements to be used in select tag.
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

function IngredientsTable() {
    // To save ingredient info (from rows) to context
    const { ingredients, setIngredients } = React.useContext(CreateRecipeIngredientsContext);

    // Set default column headers and their respective attributes
    const columns = [
        { field: 'ingredientName', headerName: 'Name', width: 200, editable: true },
        {
            field: 'ingredientImage',
            headerName: 'Image',
            width: 260,
            editable: true,
            // For rendering file upload on cell
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

    // For creating new rows on table
    const [rows, setRows] = React.useState(() => []);
    const handleAddRow = () => {
        setRows((prevState) => [...prevState, createRow()]);
    };

    /**
     * Handle file upload by first encoding the image from event as
     * base64 string, then adding said string as value for ingredientImage
     * key in rows and ingredients states.
     * @param event
     * @param id
     */
    function handleFileUpload(event, id) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;

            setRows((currentRows) => {
                const updatedRows = currentRows.map((row) => {
                    if (row.id === id) {
                        return { ...row, ingredientImage: base64String };
                    }
                    return row;
                });

                setIngredients(updatedRows);
                return updatedRows;
            });
        };

        reader.readAsDataURL(file);
    }

    const processRowUpdate = (newRow, oldRow) => {
        setRows((currentRows) => {
            const updatedRows = currentRows.map((row) => {
                if (row.id === newRow.id) {
                    return newRow;
                }
                return row;
            });

            setIngredients(updatedRows);
            return updatedRows;
        });

        return newRow;
    };

    console.log(rows);

    return (
        <div style={{ height: 400, width: '75%', marginBottom: 40 }}>
            <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleAddRow}>
                    Add a row
                </Button>
            </Stack>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    );
}

export default IngredientsTable;
