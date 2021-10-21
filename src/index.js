import "./app.css";
import "./bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import Body from './components/homeBody';

ReactDOM.render(<div>
    <NavBar />
    <Body />
    </div>, document.getElementById("root"));