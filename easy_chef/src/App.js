import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExampleComponent from './components/ExampleComponent/ExampleComponent';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import CreateRecipe from './pages/CreateRecipe/CreateRecipe';
import EditProfile from './pages/EditProfile/EditProfile';
import ViewProfile from './pages/ViewProfile/ViewProfile';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import MyRecipes from './pages/MyRecipes/MyRecipes';
import EditRecipe from './pages/EditRecipe/EditRecipe';
import RecipeDetailsPage from './pages/RecipeDetailsPage/RecipeDetailsPage';
import ShoppingCart from './pages/ShoppingCart/ShoppingCart';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { AuthProvider } from './contexts/Auth/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage';
import { SearchQueryResponseProvider } from './contexts/SearchQueryResponseContext/SearchQueryResponseContext';
import { RecipeProvider } from './contexts/RecipeContext/RecipeContext';

function App() {
    return (
        <AuthProvider>
            <SearchQueryResponseProvider>
                <RecipeProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/accounts/*" element={<PrivateRoute />}>
                                <Route path="view-profile" element={<ViewProfile />} />
                                <Route path="edit-profile" element={<EditProfile />} />
                                <Route path="logout" element={<LogoutPage />} />
                                <Route path="my-recipe" element={<MyRecipes />} />
                                <Route path="shopping-cart" element={<ShoppingCart />} />
                            </Route>
                            <Route path="/recipes/*" element={<PrivateRoute />}>
                                <Route path="create-recipe" element={<CreateRecipe />} />
                                <Route path="edit-recipe/:recipeIdPath" element={<EditRecipe />} />
                            </Route>
                            <Route
                                path="/recipes/recipe-details/:recipeId"
                                element={<RecipeDetailsPage />}
                            />
                            <Route
                                path="/search-results/:searchQuery"
                                element={<SearchResultsPage />}
                            />
                        </Routes>
                    </BrowserRouter>
                </RecipeProvider>
            </SearchQueryResponseProvider>
        </AuthProvider>
    );
}

export default App;
