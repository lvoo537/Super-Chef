import { Grid, Rating, TextareaAutosize, Typography } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchBackend from '../../Utils/fetchBackend';
import Carousel from '../../components/Carousel/Carousel';
import Carousell from './recipeDetailescarousel';
import './recipedetails.css';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import encodeImages from '../../Utils/encodeImages';

function RecipeDetailsPage() {
    const { recipeId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState([]);
    const [imageName, setImageName] = useState('');
    const [recipeImages, setRecipeImages] = useState([]);
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [ericimagesEncoded, setericImagesEncoded] = useState([]);
    const [value, setValue] = React.useState(0);
    const [average_rating_value, average_rating_setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);
    const [likes, setlikes] = useState(0);
    const [base_recipe, setbase_recipe] = useState(null);
    const [servings, setServings] = useState(0);
    const [instructions, setInstructions] = useState([]);
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
                average_rating_setValue(data.average_rating);
                setlikes(data.likes);
                if (data.base_recipe === null) {
                    setbase_recipe('No base recipe');
                } else {
                    setbase_recipe(data.base_recipe);
                }
                setServings(servings);
                setInstructions(data.instructions);
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
            encodeImagess(files); // pass files to encodeImages
        } else {
            console.log('Response not ok:', response);
        }
    };
    const encodeImagess = (files) => {
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

    const handleImages = (event) => {
        const files = Array.from(event.target.files);
        setRecipeImages(files);
        encodeImages(event, setImageName, setericImagesEncoded);
    };

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
                handleGetData();
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
                                value={average_rating_value}
                                precision={1}
                                readOnly
                            />
                        </Typography>
                    </div>

                    <div className="likes">
                        <Typography variant="h5">Likes: {likes}</Typography>
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

                    <div className="base-recipe">
                        <Typography variant="h5">Base Recipe: {base_recipe}</Typography>
                    </div>

                    <div className="servings">
                        <Typography variant="h5">Servings: {servings}</Typography>
                    </div>
                    <div className="button-container">
                        <Button variant="contained" type="submit" color="success">
                            Add to Cart
                        </Button>

                        <Button variant="contained" type="submit" color="error">
                            Add to Favourite
                        </Button>
                    </div>

                    <div className="button-container">
                        <Button variant="contained" type="submit" color="primary">
                            Like
                        </Button>

                        <Button variant="contained" type="submit" color="warning">
                            Import Recipe
                        </Button>
                    </div>
                </div>
            </div>
            <Typography
                variant="h4"
                style={{ textAlign: 'center', paddingTop: '10px', fontWeight: 'bold' }}
            >
                Instructions
            </Typography>
            <div className="instructions">
                {instructions.map((instruction, index) => (
                    <div className="instruction" key={index}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index + 1}-content`}
                                id={`panel${index + 1}-header`}
                            >
                                <Typography>Step number: {instruction.step_number}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Prep time: {instruction.prep_time}</Typography>
                                <Typography>Cooking time: {instruction.cooking_time}</Typography>
                                <br />
                                <Typography>
                                    Instructions:
                                    <br />
                                    {instruction.instruction}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                ))}
            </div>
            <div className="comments">
                <div className="comments-header">
                    <Typography variant="h5">Comments</Typography>
                </div>
                <div className="text-area">
                    <TextareaAutosize
                        minRows={10}
                        placeholder="Comment Right here"
                        style={{ width: '35%' }}
                    />
                </div>
                <div className="comment-buttons">
                    <Button variant="contained" type="submit" color="primary">
                        Post Comment!
                    </Button>

                    <Button variant="contained" component="label">
                        Upload Recipe Images
                        <input
                            type="file"
                            accept="image/"
                            hidden
                            onChange={handleImages}
                            multiple
                        />
                    </Button>
                </div>
                {ericimagesEncoded.length === 0 ? (
                    <div></div>
                ) : (
                    <Grid item xs={12} display="flex" justifyContent="left-align" sx={{ pt: '2%' }}>
                        <Carousell images={ericimagesEncoded} width={650} height={300} />
                    </Grid>
                )}
            </div>
        </>
    );
}

export default RecipeDetailsPage;
