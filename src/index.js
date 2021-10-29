import "./app.css";
import "./bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import HomeBody from './components/homeBody';

ReactDOM.render(
    <div>
        <NavBar />
        <HomeBody />
    </div>,
    document.getElementById("root"));