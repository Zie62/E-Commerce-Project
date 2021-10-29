import "./app.css";
import "./bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import ListBody from './components/singListing';

ReactDOM.render(
    <div>
        <NavBar />
        <ListBody />
    </div>,
    document.getElementById('root'));
