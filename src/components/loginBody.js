import axios from 'axios';
import React, { Component } from 'react';

class LoginBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            error: ""
        }
        this.inputHandler = this.inputHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.logCheck = this.logCheck.bind(this)
    }
    inputHandler(e, input) {
        //e is the event
        e.preventDefault();
        if (input == "mail") {
            this.setState({
                email: e.target.value
            })
        }
        else {
            this.setState({
                password: e.target.value
            })
        }
    }
    async submitHandler(e) {
        //prevents page from re-rendering
        e.preventDefault();
        /*have to configure backend to send 2 different json responses 
        based on whether the login is valid or not.*/
        let loginAttempt = await axios.post('/login', { email: this.state.email, pass: this.state.password })
        if (loginAttempt.data.status) {
            //redirects user to the homepage, as they are now logged in
            window.location.href = window.location.origin
            return
        }
        else {
            //displays error message
            this.setState({
                error: "The credentials you entered are not valid. Please check them and try again"
            })
            return
        }
    }
    logCheck() {
        if (this.props.logStatus) {
            return (
                <div id="login-form">
                    <h2>You are already logged in as {this.props.logStatus}</h2>
                </div>
            )
        }
        return (
            <>
                <form onSubmit={(e) => this.submitHandler(e)} id="login-form">
                    <label className="input-label" for="email">Email: </label> <br />
                    <input className="email-input form-input" type="email" name="email" placeholder="E-mail" onChange={(e) => this.inputHandler(e, "mail")} value={this.state.email}></input><br />
                    <label className="input-label" for="pass">Password: </label><br />
                    <input className="password-input form-input" type="password" name="pass" placeholder="Password" onChange={(e) => this.inputHandler(e, "pass")} value={this.state.password}></input>
                    <input className="submit-form" type="submit" name="submit" value="Login"></input>
                </form><br />
            </>
        )
    }
    render() {
        return (
            <div id="login-page">
                <h1>Login here:</h1><br />
                <h2 id="errors">{this.state.error}</h2>
                {this.logCheck()}
                <div id="bottom">
                    <p>Don't have an account? Register <a href="/register">here.</a></p>
                    <a id="home" href='/'>Back to home</a>
                </div>
            </div>
        )
    }
}

export default LoginBody
