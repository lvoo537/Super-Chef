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
        ingredientAmount: 0
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

// Callback function for handling on file upload
function handleFileUpload(event, id) {}

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

    // Use memoization to only re-create the function provided that
    // either ingredients, or setIngredients changes.
    const handleEditCellChange = React.useCallback(
        (params, event) => {
            // id: row id
            // field: column value
            // value: value of cell
            const { id, field, value } = params;
            // Iterate over existing state of ingredients and either
            // update the state of existing ingredient or add new
            // ingredient to state
            const updatedIngredients = ingredients.map((ingredient) => {
                if (ingredient.id === id) {
                    return { ...ingredient, [field]: value };
                }
                return ingredient;
            });

            // Update the state
            setIngredients(updatedIngredients);
        },
        [ingredients, setIngredients]
    );

    // Called when either rows or setIngredients changes values
    React.useEffect(() => {
        setIngredients(rows);
    }, [rows, setIngredients]);

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
                onEditCellChangeCommitted={handleEditCellChange}
            />
        </div>
    );
}

export default IngredientsTable;
