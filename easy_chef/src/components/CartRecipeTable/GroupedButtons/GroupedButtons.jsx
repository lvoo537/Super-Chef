import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function GroupedButtons(props) {
    const [counter, setCounter] = useState(props.servings);

    const handleIncrement = () => {
        setCounter(counter + 1);
    };

    const handleDecrement = () => {
        if (counter === 1) return;
        setCounter(counter - 1);
    };

    const displayCounter = counter > 0;

    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
            <Button onClick={handleDecrement}>-</Button>
            <Button disabled>{counter}</Button>
            <Button onClick={handleIncrement}>+</Button>
        </ButtonGroup>
    );
}

export default GroupedButtons;
