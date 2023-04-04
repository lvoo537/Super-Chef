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

function App() {
    function HomePageComponent() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>

                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <ExampleComponent text="This is an example component in Div" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<HomePageComponent />} />
                <Route path="/accounts/view-profile" element={<ViewProfile />} />
                <Route path="/accounts/edit-profile" element={<EditProfile />} />
                <Route path="/accounts/logout" element={<LogoutPage />} />
                <Route path="/accounts/my-recipe" element={<HomePageComponent />} />
                <Route path="/recipes/create-recipe" element={<CreateRecipe />} />
                <Route path="/recipes/edit-recipe/:recipeId" element={<HomePageComponent />} />
                <Route path="/recipes/recipe-details/:recipeId" element={<HomePageComponent />} />
                <Route path="/shopping-cart" element={<HomePageComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
