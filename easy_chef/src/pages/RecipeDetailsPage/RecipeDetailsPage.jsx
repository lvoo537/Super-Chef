import { Grid, Rating, Typography } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchBackend from '../../Utils/fetchBackend';
import Carousel from '../../components/Carousel/Carousel';
import './recipedetails.css';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';

function RecipeDetailsPage() {
    const { recipeId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState([]);
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);
    // Handle login form submission
    // const handleLogin = async (event = undefined) => {
    //     if (event) {
    //         event.preventDefault();
    //     }
    //
    //     const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ username: 'lekan', password: 'lekan123' })
    //     });
    //
    //     if (response.ok) {
    //         const { token } = await response.json();
    //         localStorage.setItem('authToken', token);
    //         setIsLoggedIn(true);
    //     } else {
    //         console.error('Login failed');
    //     }
    // };

    // Handle fetching data
    const handleGetData = async () => {
        try {
            const response = await fetchBackend.get(`/recipes/recipe-details/${recipeId}/`);
            // console.log(response);
            if (response.status === 200) {
                const data = response.data;
                setData(data);
            }
        } catch (error) {
            console.error('Failed to fetch data');
        }
    };
    const handleGetImages = async () => {
        const token = localStorage.getItem('access');
        const response = await fetch(
            `http://127.0.0.1:8000/recipes/${recipeId}/retrieve-recipe-files/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            const json = await response.json();
            const files = json.files;
            encodeImages(files); // pass files to encodeImages
        } else {
            console.log('Response not ok:', response);
        }
    };
    const encodeImages = (files) => {
        const encodedImages = [];
        for (let file of files) {
            const base64String = file; // replace with your base64 string
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // const blob = new Blob([byteArray], { type: 'image/png' });
            const blob = new Blob([byteArray]);
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                encodedImages.push(reader.result);
                setImagesEncoded(encodedImages);
            };
        }
    };
    const getMyRating = async () => {
        const token = localStorage.getItem('access');
        const response = await fetch(
            `http://localhost:8000/social-media/${recipeId}/retrieve-rating/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            const json = await response.json();
            if (json.error) {
                setValue(0);
            } else {
                setValue(json.rating);
            }
        } else {
            console.log('Response not ok:', response);
        }
    };

    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+'
    };

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    // const encodeImagess = (files, setImageCount, setImagesEncoded) => {
    //     const numSelected = `${files.length} Files Selected`;
    //     setImageCount(numSelected);
    //
    //     for (let file of files) {
    //         setImagesEncoded((prevState) => [...prevState, file]);
    //     }
    // };
    useEffect(() => {
        handleGetData();
        handleGetImages();
        getMyRating();
    }, []);

    useEffect(() => {
        var dataToSend = {
            rating: value
        };
        fetchBackend
            .post(`http://127.0.0.1:8000/social-media/${recipeId}/rate-recipe/`, dataToSend)
            .then((response) => {
                // From response, if successful, get the recipe ID. So update the recipe context.
            })
            .catch((error) => {});
    }, [value]);

    if (data.cooking_time) {
        const timeString = data.cooking_time;
        const [hours, minutes, seconds] = timeString.split(':');
        var totalTimeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
    }
    return (
        <>
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            <Typography variant="h3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                {data.name}
            </Typography>
            <Typography
                variant="h5"
                style={{ textAlign: 'left', paddingTop: '10px', paddingLeft: '2%' }}
            >
                {`Cooking time: ${totalTimeInMinutes} minutes`}
            </Typography>
            {/*<Grid*/}
            {/*    item*/}
            {/*    xs={12}*/}
            {/*    display="flex"*/}
            {/*    justifyContent="left-align"*/}
            {/*    style={{ paddingLeft: '2%' }}*/}
            {/*>*/}
            <div className="image-grid">
                <div className="image">
                    <Carousel images={imagesEncoded} />
                </div>
                <div className="stats">
                    <div className="rating">
                        <Typography variant="h5">
                            Average rating:{' '}
                            <Rating
                                name="rating"
                                value={data.average_rating}
                                precision={1}
                                readOnly
                            />
                        </Typography>
                    </div>

                    <div className="likes">
                        <Typography variant="h5">Likes: {data.likes}</Typography>
                    </div>

                    <div className="my-rating">
                        <Typography variant="h5" style={{ whiteSpace: 'pre-line' }}>
                            My rating:
                            <Rating
                                name="hover-feedback"
                                value={value}
                                precision={1}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={
                                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                                }
                            />
                        </Typography>
                    </div>
                </div>
                <div className="image-grid-item">
                    <Rating name="rating" value={1} precision={0.5} readOnly />
                </div>
            </div>

            {/*</Grid>*/}
        </>
    );
}

export default RecipeDetailsPage;
