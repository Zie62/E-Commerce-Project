import "./app.css";
import "./bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import FullStock from './components/fullStock';


ReactDOM.render(
    <div><NavBar /><FullStock /></div>, document.getElementById("root"));