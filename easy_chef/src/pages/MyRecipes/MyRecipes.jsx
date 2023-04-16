import { Box, Grid, Pagination, Stack, Tab, Tabs } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import RecipeCard from './NewRecipeCard';
import fetchBackend from '../../Utils/fetchBackend';
import { encodeImagesFromDb } from '../../Utils/encodeImages';

// function createCardList() {
//     const cardList = [];
//     for (let i = 0; i < 12; i++) {
//         cardList.push(
//             <Grid item key={i} md={3}>
//                 <RecipeCard
//                     recipeName={`Recipe ${i + 1}`}
//                     recipeImg={'https://source.unsplash.com/random'}
//                 />
//             </Grid>
//         );
//     }
//     return cardList;
// }

function MyRecipes() {
    const [value, setValue] = React.useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currPage, setCurrPage] = useState(1);
    const [imagesEncoded, setImagesEncoded] = useState([]);
    const [cardList, setCardList] = React.useState([]);

    // const encodeImagess = (file) => {
    //     const encodedImages = [];
    //     const base64String = file; // replace with your base64 string
    //     const byteCharacters = atob(base64String);
    //     const byteNumbers = new Array(byteCharacters.length);
    //     for (let i = 0; i < byteCharacters.length; i++) {
    //         byteNumbers[i] = byteCharacters.charCodeAt(i);
    //     }
    //     const byteArray = new Uint8Array(byteNumbers);
    //     // const blob = new Blob([byteArray], { type: 'image/png' });
    //     const blob = new Blob([byteArray]);
    //     const reader = new FileReader();
    //     reader.readAsDataURL(blob);
    //     reader.onloadend = () => {
    //         return reader.result;
    //     };
    // };

    const encodeImagess = (file) => {
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

    // const getCreatedRecipes = async () => {
    //     try {
    //         // const response = await fetchBackend.get('/social-media/my-recipes/');
    //         const token = localStorage.getItem('access');
    //         const response = await fetch('http://localhost:8000/social-media/my-recipes/', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //
    //         if (response.ok) {
    //             const json = await response.json();
    //
    //             const list_of_my_recipes = json.my_recipes.recipes_created;
    //             // console.log(list_of_my_recipes);
    //             const cardList2 = [];
    //             // console.log(list_of_my_recipes.length);
    //
    //             for (let i = 0; i < list_of_my_recipes.length; i++) {
    //                 // console.log(cardList2);
    //                 const response2 = await fetch(
    //                     `http://127.0.0.1:8000/recipes/${list_of_my_recipes[i].id}/retrieve-recipe-files/`,
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`
    //                         }
    //                     }
    //                 );
    //                 if (response2.ok) {
    //                     const json2 = await response2.json();
    //                     const files2 = json2.files[0];
    //                     console.log(files2);
    //                     // encodeImagesFromDb(files2, setImagesEncoded);
    //                     encodeImagess(files2)
    //                         .then((encodedData) => {
    //                             // do something with the encoded image data
    //                             cardList2.push(
    //                                 <Grid item key={i} md={3}>
    //                                     <RecipeCard
    //                                         recipeName={list_of_my_recipes[i].name}
    //                                         recipeId={list_of_my_recipes[i].id}
    //                                         recipeImg={encodedData}
    //                                     />
    //                                 </Grid>
    //                             );
    //                         })
    //                         .catch((error) => {
    //                             // handle errors
    //                         });
    //                 }
    //
    //                 // console.log(i);
    //             }
    //             console.log(cardList2);
    //             return cardList2;
    //         } else {
    //             console.log('Response not ok:', response);
    //         }
    //         // console.log(response);
    //     } catch (error) {
    //         console.error('Failed to fetch data');
    //     }
    // };

    const getCreatedRecipes = () => {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('access');
            fetch('http://localhost:8000/social-media/my-recipes/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Response not ok');
                    }
                    return response.json();
                })
                .then((json) => {
                    const list_of_my_recipes = json.my_recipes.recipes_created;
                    const cardList2 = [];
                    const promises = [];
                    for (let i = 0; i < list_of_my_recipes.length; i++) {
                        const promise = fetch(
                            `http://127.0.0.1:8000/recipes/${list_of_my_recipes[i].id}/retrieve-recipe-files/`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )
                            .then((response2) => {
                                if (!response2.ok) {
                                    throw new Error('Response not ok');
                                }
                                return response2.json();
                            })
                            .then((json2) => {
                                const files2 = json2.files[0];
                                return encodeImagess(files2).then((encodedData) => {
                                    const card = (
                                        <Grid item key={i} md={3}>
                                            <RecipeCard
                                                recipeName={list_of_my_recipes[i].name}
                                                recipeId={list_of_my_recipes[i].id}
                                                recipeImg={encodedData}
                                            />
                                        </Grid>
                                    );
                                    cardList2.push(card);
                                });
                            });
                        promises.push(promise);
                    }
                    Promise.all(promises)
                        .then(() => {
                            resolve(cardList2);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    // const getInteractedRecipes = async () => {
    //     try {
    //         // const response = await fetchBackend.get('/social-media/my-recipes/');
    //         const token = localStorage.getItem('access');
    //         const response = await fetch('http://localhost:8000/social-media/my-recipes/', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //
    //         if (response.ok) {
    //             const json = await response.json();
    //
    //             const list_of_my_recipes = json.my_recipes.interacted;
    //             // console.log(list_of_my_recipes);
    //             const cardList2 = [];
    //             // console.log(list_of_my_recipes.length);
    //
    //             for (let i = 0; i < list_of_my_recipes.length; i++) {
    //                 // console.log(cardList2);
    //                 const response2 = await fetch(
    //                     `http://127.0.0.1:8000/recipes/${list_of_my_recipes[i].id}/retrieve-recipe-files/`,
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`
    //                         }
    //                     }
    //                 );
    //                 if (response2.ok) {
    //                     const json2 = await response2.json();
    //                     const files2 = json2.files;
    //                     encodeImagesFromDb(files2, setImagesEncoded);
    //
    //                     cardList2.push(
    //                         <Grid item key={i} md={3}>
    //                             <RecipeCard
    //                                 recipeName={list_of_my_recipes[i].name}
    //                                 recipeId={list_of_my_recipes[i].id}
    //                                 recipeImg={imagesEncoded}
    //                             />
    //                         </Grid>
    //                     );
    //                 }
    //
    //                 // console.log(i);
    //             }
    //             return cardList2;
    //         } else {
    //             console.log('Response not ok:', response);
    //         }
    //         // console.log(response);
    //     } catch (error) {
    //         console.error('Failed to fetch data');
    //     }
    // };

    const getInteractedRecipes = () => {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('access');
            fetch('http://localhost:8000/social-media/my-recipes/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Response not ok');
                    }
                    return response.json();
                })
                .then((json) => {
                    const list_of_my_recipes = json.my_recipes.interacted;
                    const cardList2 = [];
                    const promises = [];
                    for (let i = 0; i < list_of_my_recipes.length; i++) {
                        const promise = fetch(
                            `http://127.0.0.1:8000/recipes/${list_of_my_recipes[i].id}/retrieve-recipe-files/`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )
                            .then((response2) => {
                                if (!response2.ok) {
                                    throw new Error('Response not ok');
                                }
                                return response2.json();
                            })
                            .then((json2) => {
                                const files2 = json2.files[0];
                                return encodeImagess(files2).then((encodedData) => {
                                    const card = (
                                        <Grid item key={i} md={3}>
                                            <RecipeCard
                                                recipeName={list_of_my_recipes[i].name}
                                                recipeId={list_of_my_recipes[i].id}
                                                recipeImg={encodedData}
                                            />
                                        </Grid>
                                    );
                                    cardList2.push(card);
                                });
                            });
                        promises.push(promise);
                    }
                    Promise.all(promises)
                        .then(() => {
                            resolve(cardList2);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    // const getFavouritedRecipes = async () => {
    //     try {
    //         // const response = await fetchBackend.get('/social-media/my-recipes/');
    //         const token = localStorage.getItem('access');
    //         const response = await fetch('http://localhost:8000/social-media/my-recipes/', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //
    //         if (response.ok) {
    //             const json = await response.json();
    //
    //             const list_of_my_recipes = json.my_recipes.marked_fav;
    //             // console.log(list_of_my_recipes);
    //             const cardList2 = [];
    //             // console.log(list_of_my_recipes.length);
    //
    //             for (let i = 0; i < list_of_my_recipes.length; i++) {
    //                 // console.log(cardList2);
    //                 const response2 = await fetch(
    //                     `http://127.0.0.1:8000/recipes/${list_of_my_recipes[i].id}/retrieve-recipe-files/`,
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`
    //                         }
    //                     }
    //                 );
    //                 if (response2.ok) {
    //                     const json2 = await response2.json();
    //                     const files2 = json2.files;
    //                     encodeImagesFromDb(files2, setImagesEncoded);
    //
    //                     cardList2.push(
    //                         <Grid item key={i} md={3}>
    //                             <RecipeCard
    //                                 recipeName={list_of_my_recipes[i].name}
    //                                 recipeId={list_of_my_recipes[i].id}
    //                                 recipeImg={imagesEncoded}
    //                             />
    //                         </Grid>
    //                     );
    //                 }
    //
    //                 // console.log(i);
    //             }
    //             return cardList2;
    //         } else {
    //             console.log('Response not ok:', response);
    //         }
    //         // console.log(response);
    //     } catch (error) {
    //         console.error('Failed to fetch data');
    //     }
    // };

    const getFavouritedRecipes = () => {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('access');
            fetch('http://localhost:8000/social-media/my-recipes/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Response not ok');
                    }
                    return response.json();
                })
                .then((json) => {
                    const list_of_my_recipes = json.my_recipes.marked_fav;
                    const cardList2 = [];
                    const promises = [];
                    for (let i = 0; i < list_of_my_recipes.length; i++) {
                        const promise = fetch(
                            `http://127.0.0.1:8000/recipes/${list_of_my_recipes[i].id}/retrieve-recipe-files/`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )
                            .then((response2) => {
                                if (!response2.ok) {
                                    throw new Error('Response not ok');
                                }
                                return response2.json();
                            })
                            .then((json2) => {
                                const files2 = json2.files[0];
                                return encodeImagess(files2).then((encodedData) => {
                                    const card = (
                                        <Grid item key={i} md={3}>
                                            <RecipeCard
                                                recipeName={list_of_my_recipes[i].name}
                                                recipeId={list_of_my_recipes[i].id}
                                                recipeImg={encodedData}
                                            />
                                        </Grid>
                                    );
                                    cardList2.push(card);
                                });
                            });
                        promises.push(promise);
                    }
                    Promise.all(promises)
                        .then(() => {
                            resolve(cardList2);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    // const handleChange = async (event, newValue) => {
    //     setValue(newValue);
    //     // console.log(newValue);
    //     if (newValue === 0) {
    //         const list = await getCreatedRecipes();
    //         setCardList(list);
    //     } else if (newValue === 1) {
    //         const list = await getFavouritedRecipes();
    //         setCardList(list);
    //     } else {
    //         const list = await getInteractedRecipes();
    //         setCardList(list);
    //     }
    // };
    const handleChange = (event, newValue) => {
        setValue(newValue);

        if (newValue === 0) {
            getCreatedRecipes()
                .then((list) => {
                    setCardList(list);
                })
                .catch((error) => {
                    console.error('Failed to fetch created recipes:', error);
                });
        } else if (newValue === 1) {
            getFavouritedRecipes()
                .then((list) => {
                    setCardList(list);
                })
                .catch((error) => {
                    console.error('Failed to fetch favourited recipes:', error);
                });
        } else {
            getInteractedRecipes()
                .then((list) => {
                    setCardList(list);
                })
                .catch((error) => {
                    console.error('Failed to fetch interacted recipes:', error);
                });
        }
    };

    // useEffect(() => {
    //     async function fetchData() {
    //         const list = await getCreatedRecipes();
    //         setCardList(list);
    //         console.log(list);
    //         console.log(cardList);
    //     }
    //     fetchData();
    // }, []);
    useEffect(() => {
        const fetchData = () => {
            getCreatedRecipes()
                .then((list) => {
                    setCardList(list);
                    console.log(list);
                    console.log(cardList);
                })
                .catch((error) => {
                    console.error('Failed to fetch data');
                });
        };
        fetchData();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            <Grid item xs={12}>
                {/** My Recipes Content Here  */}
                <Box display="flex" justifyContent="center" flexDirection="column" marginX={25}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="my-recipes-tab"
                            centered
                        >
                            <Tab label="Created Recipes" id="created-recipes" />
                            <Tab label="Favorited Recipes" id="favorited-recipes" />
                            <Tab label="Interacted Recipes" id="interacted-recipes" />
                        </Tabs>
                    </Box>
                    <Grid
                        justifyContent="start"
                        alignItems="center"
                        container
                        rowSpacing={2}
                        sx={{ paddingTop: '1%' }}
                    >
                        {cardList.length === 0 ? (
                            <p>List is empty</p>
                        ) : (
                            <Grid
                                justifyContent="start"
                                alignItems="center"
                                container
                                rowSpacing={2}
                            >
                                {cardList.map((reactElement) => reactElement)}
                            </Grid>
                        )}
                    </Grid>
                </Box>
                <Stack pt="0.5%" width="100%" sx={{ paddingLeft: '44%' }}>
                    <Pagination
                        count={totalPages}
                        onChange={(event, page) => {
                            setCurrPage(page);
                        }}
                        color="primary"
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}

export default MyRecipes;
