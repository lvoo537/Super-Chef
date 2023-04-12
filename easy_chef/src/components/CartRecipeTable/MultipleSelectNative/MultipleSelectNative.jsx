import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

function VirtualizedList(props) {
    function renderRow(rowProps) {
        const { index, style } = rowProps;

        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={props.ingredients[index]} />
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <Box sx={{ width: '100%', height: 400, maxWidth: 300, bgcolor: 'background.paper' }}>
            <FixedSizeList
                height={400}
                width={360}
                itemSize={props.itemSize}
                itemCount={props.ingredients.length}
                overscanCount={1}
            >
                {renderRow}
            </FixedSizeList>
        </Box>
    );
}

export default VirtualizedList;
