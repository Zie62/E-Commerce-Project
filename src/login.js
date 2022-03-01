import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginBody from './components/loginBody';
import Footer from './components/footer';
import Axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logStatus: false
        }
    }
    async componentDidMount() {
        let logStatus = await Axios.get("/loginStatus")
        this.setState({
            logStatus: logStatus.data.email
        })
    }
    render() {
        return (
            <div>
                <LoginBody logStatus={this.state.logStatus}/>
            </div>
        )
    }
}

ReactDOM.render(<Login />, document.getElementById('root'));
