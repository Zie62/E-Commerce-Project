import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Registration from './components/registrationBody';
import Footer from './components/footer';
import Axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logStatus: false
        }
    }
    render() {
        return (
            <div>
                <Registration logStatus={this.state.logStatus} />
            </div>
        )
    }
}

ReactDOM.render(<Login />, document.getElementById('root'));
