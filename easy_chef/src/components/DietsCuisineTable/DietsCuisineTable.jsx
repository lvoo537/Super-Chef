import * as React from 'react';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

// For setting ID of row
let idCounter = 0;
/**
 * Create a new row (with default values)
 * @returns {{cuisine: string, diet: number, id: number}}
 */
const createRow = () => {
    idCounter += 1;
    return {
        id: idCounter,
        cuisine: '',
        diet: ''
    };
};

export default function DietsCuisineTable({ setDiets, setCuisines, width }) {
    const columns = [
        { field: 'cuisine', headerName: 'Cuisines', width: 350, editable: true },
        {
            field: 'diet',
            headerName: 'Diets',
            width: 350,
            editable: true
        }
    ];

    // For creating new rows on table
    const [rows, setRows] = React.useState(() => []);
    const [selectedRows, setSelectedRows] = React.useState([]);

    const handleAddRow = () => {
        setRows((prevState) => [...prevState, createRow()]);
    };

    const handleDeleteRow = () => {
        setRows((prevState) => prevState.filter((row) => !selectedRows.includes(row.id)));
    };

    const processRowUpdate = (newRow, oldRow) => {
        setRows((currentRows) => {
            const dietsArray = [];
            const cuisinesArray = [];
            const updatedRows = currentRows.map((row) => {
                if (row.id === newRow.id) {
                    dietsArray.push(newRow.diet);
                    cuisinesArray.push(newRow.cuisine);
                    return newRow;
                }
                dietsArray.push(row.diet);
                cuisinesArray.push(row.cuisine);
                return row;
            });

            setDiets(dietsArray);
            setCuisines(cuisinesArray);

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
                rows={rows}
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
