import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useCreateIngredientsContext } from '../../contexts/CreateRecipeIngredientsContext/CreateRecipeIngredientsContext';

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
        name: '',
        quantity: 0,
        unit_of_measure: measurements[0]
    };
};

// Measurements to be used in select tag.
const measurements = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pinch', 'unit'];
function IngredientsTable({ width }) {
    // To save ingredient info (from rows) to context
    const { ingredients, setIngredients } = useCreateIngredientsContext();

    // Set default column headers and their respective attributes
    const columns = [
        { field: 'name', headerName: 'Name', width: 500, editable: true },
        {
            field: 'quantity',
            headerName: 'Amount',
            type: 'number',
            width: 130,
            editable: true
        },
        {
            field: 'unit_of_measure',
            headerName: 'Measure',
            width: 90,
            editable: true,
            type: 'singleSelect',
            valueOptions: measurements
        }
    ];

    // For creating new rows on table
    const [selectedRows, setSelectedRows] = React.useState([]);

    const handleAddRow = () => {
        setIngredients((prevState) => [...prevState, createRow()]);
    };

    const handleDeleteRow = () => {
        setIngredients((prevState) => prevState.filter((row) => !selectedRows.includes(row.id)));
    };

    const processRowUpdate = (newRow, oldRow) => {
        setIngredients((currentRows) => {
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

    return (
        <div style={{ height: 400, width: width, marginBottom: 40 }}>
            <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleAddRow}>
                    Add a row
                </Button>
                <Button size="small" onClick={handleDeleteRow}>
                    Delete selected row
                </Button>
            </Stack>
            <DataGrid
                rows={ingredients}
                columns={columns}
                editMode="row"
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedRows(newRowSelectionModel);
                }}
                rowSelectionModel={selectedRows}
                sx={{ mt: 1 }}
            />
        </div>
    );
}

export default IngredientsTable;
