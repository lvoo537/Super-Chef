import {
    CircularProgress,
    Grid,
    Rating,
    Stack,
    Switch,
    TextareaAutosize,
    Typography
} from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchBackend, { fetchBackendImg } from '../../Utils/fetchBackend';
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
import encodeImages, { encodeImagesFromDb } from '../../Utils/encodeImages';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';

function RecipeDetailsPage() {
    const { recipeId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState([]);
    const [imageName, setImageName] = useState('');
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [instructionimagesEncoded, setinstructionImagesEncoded] = useState([]);
    const [ericimagesEncoded, setericImagesEncoded] = useState([]);
    const [value, setValue] = React.useState(0);
    const [average_rating_value, average_rating_setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);
    const [likes, setlikes] = useState(0);
    const [base_recipe, setbase_recipe] = useState(null);
    const [servings, setServings] = useState(0);
    const [instructions, setInstructions] = useState([]);
    const [instrImagesLoaded, setInstrImagesLoaded] = useState(false);
    const [commentImagesLoaded, setCommentImagesLoaded] = useState(false);
    const [comments, setComments] = useState([]);
    const [postCommentImages, setPostCommentImages] = useState([]);
    const [postCommentValue, setPostCommentValue] = useState('');
    const [formError, setFormError] = useState({
        errorOccurred: false,
        errorMsg: ''
    });
    const [checked, setChecked] = React.useState(undefined);
    const [checkedfavourite, setCheckedfavourite] = React.useState(undefined);

    const handleChangefavourite = (event) => {
        setCheckedfavourite(event.target.checked);
    };
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    useEffect(() => {
        if (checked === true) {
            handlelike();
        } else {
            handleUnlike();
        }
    }, [checked]);

    useEffect(() => {
        if (checkedfavourite === true) {
            handleFavourite();
        } else {
            handleUnFavourite();
        }
    }, [checkedfavourite]);

    const handleFavourite = () => {
        fetchBackend
            .post(`/social-media/${recipeId}/favorite-recipe/`)
            .then((response) => {
                // handle the response from the server here
                if (response.ok) {
                    // success - item was added to the cart
                    console.log('Item was favorited!');
                } else {
                    // error - something went wrong
                    console.error('Error, favoriting recipe:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error2, favoriting recipe:', error);
            });
    };
    const handleUnFavourite = () => {
        fetchBackend
            .delete(`/social-media/${recipeId}/unfavorite-recipe/`)
            .then((response) => {
                // handle the response from the server here
                if (response.ok) {
                    // success - item was added to the cart
                    console.log('Item was Unfavorited!');
                } else {
                    // error - something went wrong
                    console.error('Error, Unfavoriting recipe:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error2, Unfavoriting recipe:', error);
            });
    };

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
                const instructionsResponse = data.instructions;
                if (instructionsResponse.length === 0) setInstrImagesLoaded(true);

                // Use Promise.all to wait for all the async operations to finish
                await Promise.all(
                    instructionsResponse.map(async (instr) => {
                        try {
                            const res = await fetchBackend.get(
                                `/recipes/${instr.id}/retrieve-instruction-files/`
                            );
                            console.log(`Successfully retrieved images for ${instr.id}`);
                            const encodedImages = await encodeImagesFromDb(res.data.files);
                            instr.instructionImagesEncoded = encodedImages;
                        } catch (err) {
                            console.log(err);
                        }
                    })
                );

                setInstructions(instructionsResponse);
                setInstrImagesLoaded(true);
                // const instructionsResponse = data.instructions;
                // if (instructionsResponse.length === 0) setInstrImagesLoaded(true);
                //
                // for (let i = 0; i < instructionsResponse.length; i++) {
                //     const instr = instructions[i];
                //     fetchBackend
                //         .get(`/recipes/${instr.id}/retrieve-instruction-files/`)
                //         .then((res) => {
                //             console.log(`Successfully retrieved images for ${instr.id}`);
                //             encodeImagesFromDb(res.data.files, setinstructionImagesEncoded);
                //             instr.instructionImagesEncoded = instructionimagesEncoded;
                //             if (i === instructionsResponse.length - 1) {
                //                 setInstructions(instructionsResponse);
                //                 setInstrImagesLoaded(true);
                //             }
                //         })
                //         .catch((err) => {
                //             console.log(err);
                //         });
                // }
                const commentsResponse = data.comments;
                if (commentsResponse.length === 0) setCommentImagesLoaded(true);
                await Promise.all(
                    commentsResponse.map(async (comment) => {
                        try {
                            const res = await fetchBackend.get(
                                `/recipes/${comment.id}/retrieve-comment-files`
                            );
                            if (res.data.files && res.data.files.length !== 0) {
                                console.log(`Successfully retrieved images for ${comment.id}`);
                            }
                            const encodedImages = await encodeImagesFromDb(res.data.files);
                            comment.commentImagesEncoded = encodedImages;
                        } catch (err) {
                            console.log(err);
                        }
                    })
                );
                setComments(commentsResponse);
                setCommentImagesLoaded(true);

                fetchBackend
                    .get(`/social-media/${recipeId}/isliked/`)
                    .then((response) => {
                        // handle the response from the server here
                        setChecked(response.data.message);
                    })
                    .catch((error) => {
                        console.error('Error2dvfvd :', error);
                    });
                fetchBackend
                    .get(`/social-media/${recipeId}/isfavourited/`)
                    .then((response) => {
                        // handle the response from the server here
                        setCheckedfavourite(response.data.message);
                    })
                    .catch((error) => {
                        console.error('Error2dvfvd :', error);
                    });
            }
        } catch (error) {
            console.error('Failed to fetch data');
            console.log(error);
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

    const handleGetinstructionImages = async (instruction_id) => {
        const token = localStorage.getItem('access');
        const response = await fetch(
            `http://127.0.0.1:8000/recipes/${instruction_id}/retrieve-instruction-files/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            const json = await response.json();
            const files = json.files;
            promiseencodeImagess(files); // pass files to encodeImages
        } else {
            console.log('Response not ok:', response);
        }
    };
    const promiseencodeImagess = (file) => {
        return new Promise((resolve, reject) => {
            const base64String = file; // replace with your base64 string
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
        });
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
        setPostCommentImages(files);
        encodeImages(event, setImageName, setericImagesEncoded);
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        fetchBackend
            .post(`/recipes/${recipeId}/add-to-cart/`)
            .then((response) => {
                // handle the response from the server here
                if (response.ok) {
                    // success - item was added to the cart
                    console.log('Item added to cart!');
                } else {
                    // error - something went wrong
                    console.error('Error adding item to cart:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error adding item to cart:', error);
            });
    };

    const handlelike = () => {
        fetchBackend
            .post(`/social-media/${recipeId}/like-recipe/`)
            .then((response) => {
                // handle the response from the server here
                if (response.ok) {
                    // success - item was added to the cart
                    console.log('Item was liked!');
                } else {
                    // error - something went wrong
                    console.error('Error, adding liking recipe:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error2, liking recipe:', error);
            });
    };

    const handleUnlike = () => {
        fetchBackend
            .delete(`/social-media/${recipeId}/unlike-recipe/`)
            .then((response) => {
                // handle the response from the server here
                if (response.ok) {
                    // success - item was added to the cart
                    console.log('Item was liked!');
                } else {
                    // error - something went wrong
                    console.error('Error, adding liking recipe:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error2, liking recipe:', error);
            });
    };

    const handlePostSubmission = (event) => {
        event.preventDefault();

        const formDataImages = new FormData();
        for (let i = 0; i < postCommentImages.length; i++) {
            const image = postCommentImages[i];
            formDataImages.append('file' + i, image);
        }
        fetchBackend
            .post(`/social-media/${recipeId}/comment-on-recipe/`, { comment: postCommentValue })
            .then((res) => {
                console.log(`Successfully commented on recipe ${recipeId}`);
                const commentId = res.data.comment_id;
                fetchBackendImg
                    .post(
                        `/social-media/comment-on-recipes/attach-files/${commentId}/`,
                        formDataImages
                    )
                    .then((res) => {
                        console.log(`Successfully attached files onto comment, ${commentId}`);
                        setComments((prevState) => [...prevState, postCommentValue]);
                        setPostCommentValue('');
                        setPostCommentImages([]);
                        setericImagesEncoded([]);
                        handleGetData();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                setFormError({
                    errorOccurred: true,
                    errorMsg: 'Either comment is required or comment must be <= 200 characters'
                });
            });
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

    if (!instrImagesLoaded && !commentImagesLoaded) {
        return (
            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={12}>
                    <Navbar />
                </Grid>
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            <Typography variant="h3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                {data.name}
            </Typography>
            {formError.errorOccurred ? (
                <Typography variant="h5" style={{ color: 'red' }}>
                    {formError.errorMsg}
                </Typography>
            ) : (
                <div></div>
            )}
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
                        <Button
                            variant="contained"
                            type="submit"
                            color="success"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>

                        <FormControlLabel
                            control={
                                <Switch
                                    size="medium"
                                    checked={checkedfavourite}
                                    onChange={handleChangefavourite}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '1.25rem', // increase the font size
                                        // fontWeight: 'bold', // add bold weight
                                        textTransform: 'uppercase' // change the text case to uppercase
                                    }}
                                >
                                    Favourite/UnFavourite
                                </Typography>
                            }
                        />
                    </div>

                    <div className="button-container">
                        <FormControlLabel
                            control={
                                <Switch
                                    size="medium"
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '1.25rem', // increase the font size
                                        // fontWeight: 'bold', // add bold weight
                                        textTransform: 'uppercase' // change the text case to uppercase
                                    }}
                                >
                                    Like/Unlike
                                </Typography>
                            }
                        />

                        {/*<Button variant="contained" type="submit" color="warning">*/}
                        {/*    Import Recipe*/}
                        {/*</Button>*/}
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
                                <Typography>Instruction: {instruction.step_number}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="accordion-times">
                                    <Typography style={{ marginRight: '9%' }}>
                                        Prep time: {instruction.prep_time}
                                    </Typography>

                                    <Typography>
                                        Cooking time: {instruction.cooking_time}
                                    </Typography>
                                </div>

                                <br />
                                {instruction.instructionImagesEncoded === undefined ||
                                instruction.instructionImagesEncoded.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <div className="instruction-image">
                                        <Carousel images={instruction.instructionImagesEncoded} />
                                    </div>
                                )}
                                <Typography>
                                    Instruction Details:
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
                        value={postCommentValue}
                        onChange={(e) => setPostCommentValue(e.target.value)}
                    />
                </div>
                <div className="comment-buttons">
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        onClick={handlePostSubmission}
                    >
                        Post Comment!
                    </Button>

                    <Button variant="contained" component="label">
                        Upload Comment Images
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
                <br />
                <div className="user-comments">
                    <Stack spacing={2}>
                        {comments.map((comment, index) => (
                            <div className="comment-item">
                                <div className="comment-user-image">
                                    <Avatar
                                        sx={{ width: 20, height: 20 }}
                                        src="/broken-image.jpg"
                                    />
                                </div>
                                <div className="individual-comment">
                                    {comment.commentImagesEncoded === undefined ||
                                    comment.commentImagesEncoded.length === 0 ? (
                                        <div></div>
                                    ) : (
                                        <Carousell images={comment.commentImagesEncoded} />
                                    )}
                                    <Typography variant="h5">{comment.comment}</Typography>
                                </div>
                            </div>
                        ))}
                    </Stack>
                </div>
            </div>
        </>
    );
}

export default RecipeDetailsPage;
