import "./app.css";
import "./bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import App from './components/App';
import Body from './components/homeBody';

ReactDOM.render(<div>
    <App />
    <Body />
    </div>, document.getElementById("root"));