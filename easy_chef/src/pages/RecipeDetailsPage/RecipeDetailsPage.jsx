import { Grid, Typography } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetailsPage() {
    const { recipeId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState([]);

    // Handle login form submission
    const handleLogin = async (event = undefined) => {
        if (event) {
            event.preventDefault();
        }

        const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'lekan', password: 'lekan123' })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            setIsLoggedIn(true);
        } else {
            console.error('Login failed');
        }
    };

    // Handle fetching data
    const handleGetData = async () => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://127.0.0.1:8000/recipes/recipe-details/${recipeId}/`, {
            headers: { Authorization: `Token ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            setData(data);
        } else {
            console.error('Failed to fetch data');
        }
    };
    useEffect(() => {
        const login = async () => {
            await handleLogin();
            await handleGetData();
        };
        login();
    }, []);
    return (
        <>
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            {/*{data.length > 0 ? (*/}
            {/*    <Typography*/}
            {/*        variant="h3"*/}
            {/*        gutterBottom*/}
            {/*        style={{ textAlign: 'center', paddingTop: '10px' }}*/}
            {/*    >*/}
            {/*        {data.title}*/}
            {/*    </Typography>*/}
            {/*) : (*/}
            {/*    <Typography*/}
            {/*        variant="h3"*/}
            {/*        gutterBottom*/}
            {/*        style={{ textAlign: 'center', paddingTop: '10px' }}*/}
            {/*    >*/}
            {/*        Loading...*/}
            {/*    </Typography>*/}
            {/*)}*/}
            {isLoggedIn && (
                <Typography
                    variant="h3"
                    gutterBottom
                    style={{ textAlign: 'center', paddingTop: '10px' }}
                >
                    {data.name}
                </Typography>
            )}
        </>
    );
}

export default RecipeDetailsPage;
