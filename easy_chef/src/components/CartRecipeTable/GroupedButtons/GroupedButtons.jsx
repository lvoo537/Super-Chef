import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

function GroupedButtons() {
    const [counter, setCounter] = useState(0);

    const handleIncrement = () => {
        setCounter(counter + 1);
    };

    const handleDecrement = () => {
        setCounter(counter - 1);
    };

    const displayCounter = counter > 0;

    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
            <Button onClick={handleIncrement}>+</Button>
            {displayCounter && <Button disabled>{counter}</Button>}
            {displayCounter && <Button onClick={handleDecrement}>-</Button>}
        </ButtonGroup>
    );
}

export default GroupedButtons;
