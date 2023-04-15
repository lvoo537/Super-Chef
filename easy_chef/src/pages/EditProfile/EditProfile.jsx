import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
    FormControl,
    FormGroup,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Navbar from '../../components/Navbar/Navbar';
import fetchBackend from '../../Utils/fetchBackend';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

function EditProfile() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [terms, setTerms] = useState(false);
    const [username, setUsername] = useState('');

    const getProfileUrl = `http://localhost:8000/accounts/get-user-info/`;
    const fetcher = (url) => fetchBackend.get(url).then((res) => res.data);
    const { data, error } = useSWR(getProfileUrl, fetcher);

    const [formError, setFormError] = useState({
        errorStatus: false,
        errorMsg: <div></div>
    });

    useEffect(() => {
        if (data) {
            console.log(data);
            setBio(data.bio !== null ? data.bio : '');
            setDob(data.date_of_birth);
            setEmail(data.email);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setLocation(data.location !== null ? data.location : '');
            setPhone(data.phone);
            setUsername(data.username);
        }
    }, [data]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmission = (event) => {
        event.preventDefault();

        if (password.length !== 0 && password !== repeatPassword) {
            navigate('/accounts/edit-profile');
            return;
        }

        const dataToSend = {
            username,
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            date_of_birth: dob,
            bio,
            location,
            old_password: password
        };

        console.log(dataToSend);

        fetchBackend
            .post('/accounts/profile/edit/', dataToSend)
            .then((response) => {
                navigate('/');
            })
            .catch((err) => {
                if (err.response.data && err.response.data['username']) {
                    setFormError({
                        errorStatus: true,
                        errorMsg: (
                            <Typography sx={{ color: 'red' }}>
                                {err.response.data['username']}
                            </Typography>
                        )
                    });
                }
                // navigate('/accounts/edit-profile');
            });
    };

    return (
        <div>
            <Navbar />
            <Grid container spacing={2} paddingX="20%" marginTop={5}>
                <Grid item xs={12}>
                    <Box component="form" onSubmit={handleSubmission}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    id="first-name"
                                    label="First Name"
                                    variant="outlined"
                                    value={firstName}
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                    }}
                                    sx={{ paddingRight: '1vw' }}
                                />
                                <TextField
                                    id="last-name"
                                    label="Last Name"
                                    variant="outlined"
                                    value={lastName}
                                    onChange={(event) => {
                                        setLastName(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '68%'
                                    }}
                                >
                                    <TextField
                                        id="username"
                                        label="New Username"
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                        value={username}
                                        onChange={(event) => {
                                            setUsername(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        id="date-of-birth"
                                        label="Date of Birth"
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                        value={dob}
                                        onChange={(event) => {
                                            setDob(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        id="phone-number"
                                        label="Phone Number"
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                        value={phone}
                                        onChange={(event) => {
                                            setPhone(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        id="bio"
                                        label="Bio"
                                        multiline
                                        rows={8}
                                        placeholder="Write something here..."
                                        value={bio}
                                        onChange={(event) => {
                                            setBio(event.target.value);
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        flexDirection: 'column'
                                    }}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Profile Picture
                                    </Typography>
                                    <Avatar
                                        sx={{ width: 200, height: 200, justifySelf: 'center' }}
                                        alt="Name"
                                        src="/static/images/avatar/2.jpg"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="location"
                                    label="Location"
                                    variant="outlined"
                                    value={location}
                                    onChange={(event) => {
                                        setLocation(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        flexDirection: 'column'
                                    }}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <FormControl variant="outlined" sx={{ maxWidth: 250 }}>
                                        <InputLabel htmlFor="password1">New Password</InputLabel>
                                        <OutlinedInput
                                            id="password1"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                            }}
                                            label="New Password"
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="email"
                                    label="Email Address"
                                    variant="outlined"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        flexDirection: 'column'
                                    }}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <FormControl variant="outlined" sx={{ maxWidth: 250 }}>
                                        <InputLabel htmlFor="password2">Repeat Password</InputLabel>
                                        <OutlinedInput
                                            id="password2"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            value={repeatPassword}
                                            onChange={(event) => {
                                                setRepeatPassword(event.target.value);
                                            }}
                                            label="Password"
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value="eula"
                                                color="primary"
                                                checked={terms}
                                                onChange={(event) => {
                                                    setTerms(event.target.checked);
                                                }}
                                                required
                                            />
                                        }
                                        label="I agree with the terms and conditions."
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                {formError.errorStatus ? formError.errorMsg : <div></div>}
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">
                                    Update Profile
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default EditProfile;
