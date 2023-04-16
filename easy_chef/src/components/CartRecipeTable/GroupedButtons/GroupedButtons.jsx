import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import fetchBackend from '../../../Utils/fetchBackend';

function GroupedButtons(props) {
    const [counter, setCounter] = useState(props.servings);
    // if button click is +, increment counter and call backend to update servings in shopping cart and update servings
    // if button click is -, decrement counter and call backend to update servings in shopping cart and update servings

    useEffect(() => {
        const dataToSend = {
            servings: counter
        };
        fetchBackend
            .post(`/recipes/${props.recipeId}/update-recipe-servings`, dataToSend)
            .then((res) => {
                if (res.status === 200) {
                    console.log(
                        `Recipe with ID ${props.recipeId} has been successfully updated in cart.`
                    );
                    props.setChangeMade(true);
                } else {
                    console.log(
                        `Failed to update recipe with ID ${props.recipeId} in cart: ${res}`
                    );
                }
            })
            .catch((error) => {
                console.log(`Failed to update recipe with ID ${props.recipeId} in cart: ${error}`);
            });
    }, [counter]);

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
