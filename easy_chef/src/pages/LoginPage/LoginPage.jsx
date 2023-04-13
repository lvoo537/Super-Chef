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
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchBackend from '../../Utils/fetchBackend';

const theme = createTheme();

function LoginPage() {
    const navigate = useNavigate();

    const { setAuthenticated, authenticated } = useAuthContext();

    // state for TextField error handling
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // get the email and password values on text-fields (form)
        const data = new FormData(event.currentTarget);
        const dataToSend = {
            username: data.get('username'),
            password: data.get('password')
        };

        // hit backend endpoint and redirect to home on success.
        // otherwise, set text-field error messages appropriately.
        fetchBackend
            .post('/accounts/login/', dataToSend)
            .then((response) => {
                localStorage.setItem('access', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);

                setAuthenticated(true);
                navigate('/');
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setFormError({ errorOccurred: true, errorMsg: error.response.data });
                }
            });
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
                                Sign in
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    error={formError.errorOccurred}
                                    helperText={formError.errorMsg}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    error={formError.errorOccurred}
                                    helperText={formError.errorMsg}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item sx={{ margin: 'auto' }}>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item sx={{ margin: 'auto' }}>
                                        <Link href="#" variant="body2">
                                            Don't have an account? Sign Up
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
}

export default LoginPage;
