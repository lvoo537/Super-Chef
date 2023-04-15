import * as React from 'react';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Create a single-column table with "add row" and "delete row" features.
 * @param colName Name of column header
 * @param tableWidth Width of table
 * @param rows Default rows to display. Must be in format of [{ id: number, col: string }, ...]
 * @param setRows Default setter for the state rows
 * @param setRowVals State setter for where to write the list of row values
 * @param idCounter ID counter for uniquely identifying rows
 * @returns {JSX.Element}
 * @constructor
 */
export default function SingleColTable({
    colName,
    tableWidth,
    rows,
    setRows,
    setRowVals,
    idCounter
}) {
    /**
     * Create a new row (with blank values)
     * @returns {{col: string, id: number}}
     */
    const createRow = () => {
        idCounter += 1;
        return {
            id: idCounter,
            col: ''
        };
    };

    const columns = [{ field: 'col', headerName: colName, width: 350, editable: true }];

    // For creating new rows on table
    const [selectedRows, setSelectedRows] = React.useState([]);

    const handleAddRow = () => {
        setRows((prevState) => [...prevState, createRow()]);
    };

    const handleDeleteRow = () => {
        setRows((prevState) => prevState.filter((row) => !selectedRows.includes(row.id)));
    };

    const processRowUpdate = (newRow, oldRow) => {
        setRows((currentRows) => {
            const rowVals = [];
            const updatedRows = currentRows.map((row) => {
                if (row.id === newRow.id) {
                    rowVals.push(newRow.col);
                    return newRow;
                }
                rowVals.push(row.col);
                return row;
            });

            setRowVals(rowVals);

            return updatedRows;
        });

        return newRow;
    };

    return (
        <div style={{ height: 400, width: tableWidth, marginBottom: 40 }}>
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
