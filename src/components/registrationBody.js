import React, { Component } from 'react';
import Axios from 'axios';

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
        e.preventDefault();
        let registrationStatus
        //email testing regular expression to force using a period for the domain
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        //tests if the email meets the requirements for an email
        if (emailRegex.test(this.state.email)) {
            try {
                registrationStatus = await Axios.post("/register", {
                    email: this.state.email,
                    pass: this.state.password
                })
            }
            catch (error) {
                //if theres an error, set it in the state so it can be displayed
                this.setState({
                    error: "There was an issue submitting your registration, please try again"
                })
                return
            }
            if (registrationStatus.data.status) {
                window.location.href = window.location.origin + "/login"
            }
            else {
                this.setState({
                    error: "An account with this email already exists"
                })
            }
        }
        else {
            //if the email is not valid within the regex provoided, this error message is displayed
            this.setState({
                error: "The email format is invalid"
            })
            return
        }
    }
    render() {
        return (
            <>
                <div id="login-page">
                    <h1>Register here:</h1><br />
                    <h3 id="errors">{this.state.error}</h3>
                    <form id="login-form" onSubmit={(e) => { this.submitHandler(e) }}>
                        <label className="input-label" for="email">Email: </label> <br />
                        <input className="email-input form-input" type="email" name="email" placeholder="E-mail" onChange={(e) => this.inputHandler(e, "mail")} value={this.state.email}></input><br />
                        <label className="input-label" for="pass">Password: </label><br />
                        <input className="password-input form-input" type="password" name="pass" placeholder="Password" onChange={(e) => this.inputHandler(e, "pass")} value={this.state.password}></input>
                        <input className="submit-form" type="submit" name="submit" value="Submit"></input>
                    </form><br />
                </div>
                <div id="bottom">
                    <h5>Back to <a href="/">Home</a> or <a href="/login">Login</a></h5>
                </div>
            </>
        )
    }
}

export default LoginBody
