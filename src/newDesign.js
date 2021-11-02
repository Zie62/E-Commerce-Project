import React from 'react';
import ReactDOM from 'react-dom';
import "./newApp.css"
import NavBar from "./components/newNav"
import FullStock from './components/fullStock';

ReactDOM.render(
    <div>
        <NavBar />
        <FullStock />
    </div>,
    document.getElementById("root"));