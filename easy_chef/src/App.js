import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExampleComponent from './components/ExampleComponent/ExampleComponent';
import LoginPage from './pages/LoginPage/LoginPage';

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
                <Route path="/" element={<HomePageComponent />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<HomePageComponent />} />
                <Route path="/accounts/edit-profile" element={<HomePageComponent />} />
                <Route path="/accounts/my-recipe" element={<HomePageComponent />} />
                <Route path="/recipes/create-recipe" element={<HomePageComponent />} />
                <Route path="/recipes/edit-recipe/:recipeId" element={<HomePageComponent />} />
                <Route path="/recipes/recipe-details/:recipeId" element={<HomePageComponent />} />
                <Route path="/shopping-cart" element={<HomePageComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
