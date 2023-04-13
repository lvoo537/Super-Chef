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

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/accounts/view-profile"
                        element={<PrivateRoute element={<ViewProfile />} />}
                    />
                    <Route
                        path="/accounts/edit-profile"
                        element={<PrivateRoute element={<EditProfile />} />}
                    />
                    <Route
                        path="/accounts/logout"
                        element={<PrivateRoute element={<LogoutPage />} />}
                    />
                    <Route
                        path="/accounts/my-recipe"
                        element={<PrivateRoute element={<MyRecipes />} />}
                    />
                    <Route
                        path="/recipes/create-recipe"
                        element={<PrivateRoute element={<CreateRecipe />} />}
                    />
                    <Route
                        path="/recipes/edit-recipe/:recipeId"
                        element={<PrivateRoute element={<EditRecipe />} />}
                    />
                    <Route
                        path="/recipes/recipe-details/:recipeId"
                        element={<RecipeDetailsPage />}
                    />
                    <Route
                        path="/shopping-cart"
                        element={<PrivateRoute element={<ShoppingCart />} />}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
