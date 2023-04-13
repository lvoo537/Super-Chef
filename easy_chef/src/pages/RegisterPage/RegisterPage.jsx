import * as React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchBackend from '../../Utils/fetchBackend';
import { useAuthContext } from '../../contexts/Auth/AuthContext';

const theme = createTheme();

function RegisterPage() {
    const navigate = useNavigate();

    // state for TextField error handling
    const [formErrors, setFormErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        username: '',
        password: '',
        password2: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        // get the form data
        const data = new FormData(event.currentTarget);
        const dataToSend = JSON.stringify({
            first_name: data.get('first_name'),
            last_name: data.get('last_name'),
            date_of_birth: data.get('date_of_birth'),
            phone_number: data.get('phone_number'),
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            password2: data.get('password2')
        });

        // hit backend endpoint and redirect to home on success.
        // otherwise, set text-field error messages appropriately.

        fetchBackend
            .post('/accounts/register/', dataToSend)
            .then((response) => {
                // assuming uid is returned from data
                // setUid(response.data);
                navigate('/');
            })
            .catch((errors) => {
                setFormErrors({
                    first_name: errors.response.data.first_name
                        ? errors.response.data.first_name[0]
                        : '',
                    last_name: errors.response.data.last_name
                        ? errors.response.data.last_name[0]
                        : '',
                    email: errors.response.data.email ? errors.response.data.email[0] : '',
                    phone_number: errors.response.data.phone_number
                        ? errors.response.data.phone_number[0]
                        : '',
                    date_of_birth: errors.response.data.date_of_birth
                        ? errors.response.data.date_of_birth[0]
                        : '',
                    username: errors.response.data.username ? errors.response.data.username[0] : '',
                    password: errors.response.data.password ? errors.response.data.password[0] : '',
                    password2: errors.response.data.password2
                        ? errors.response.data.password2[0]
                        : ''
                });
            });

        // fetchBackend
        //     .post('http://127.0.0.1:8000/accounts/register/', dataToSend)
        //     .then((response) => {
        //         // setAuthenticated(true);
        //         // assuming uid is returned from data
        //         // setUid(response.data);
        //         navigate('/');
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         // if (error.response.status === 401) {
        //         //     setFormError({ errorOccurred: true, errorMsg: error.response.data });
        //         // }
        //     });
    };

    return (
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
                <Navbar></Navbar>
            </Grid>
            <Grid item xs={12}>
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Register
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <div style={{ display: 'flex', gap: '1em' }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        // halfWidth
                                        id="first_name"
                                        label="First Name"
                                        name="first_name"
                                        placeholder="Enter first name"
                                        autoFocus
                                        error={!!formErrors.first_name}
                                        helperText={formErrors.first_name}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        // halfWidth
                                        id="last_name"
                                        label="Last Name"
                                        name="last_name"
                                        placeholder="Enter last name"
                                        autoFocus
                                        error={!!formErrors.last_name}
                                        helperText={formErrors.last_name}
                                    />
                                </div>

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    placeholder={'Enter email address'}
                                    autoFocus
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="tel"
                                    id="phone"
                                    label={'Phone Number'}
                                    name="phone_number"
                                    placeholder="Enter phone number"
                                    autoFocus
                                    error={!!formErrors.phone_number}
                                    helperText={formErrors.phone_number}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="date_of_birth"
                                    label="Date of Birth"
                                    placeholder={'YYYY-MM-DD'}
                                    name="date_of_birth"
                                    autoFocus
                                    error={!!formErrors.date_of_birth}
                                    helperText={formErrors.date_of_birth}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    placeholder="Enter username"
                                    autoFocus
                                    error={!!formErrors.username}
                                    helperText={formErrors.username}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    error={!!formErrors.password}
                                    helperText={formErrors.password}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password2"
                                    label="Repeat Password"
                                    type="password"
                                    id="repeat_password"
                                    error={!!formErrors.password2}
                                    helperText={formErrors.password2}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
}

export default RegisterPage;
