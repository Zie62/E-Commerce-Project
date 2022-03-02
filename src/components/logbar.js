import React, { Component } from 'react';
import Axios from 'axios';

//this is a login bar function that determines whether or not a user is logged in

class LogBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logStatus: false
        }
        this.logOut = this.logOut.bind(this)
    }
    async componentDidMount() {
        try{
        let logStatus = await Axios.get("/loginStatus")
        this.setState({
            logStatus: logStatus.data.email 
        })
    }   
    catch {
        //dont need to do anything, just prevent logStatus from being overwritten with undefined/error
    }
    }
    logOut(e) {
        e.preventDefault();
        //doesnt need to be awaited as I dont need any response data
        Axios.post('/logout', { email: this.state.logStatus })
        this.setState({
            logStatus: false
        })
        this.props.logout()
        return
    }
    render() {
        if (this.state.logStatus) {
            //if the user is logged in (which will be truthy), display their login email
            return (
                <div id="login-bar">
                    <p className="login">User: {this.state.logStatus}</p>
                    <a href="" onClick={(e) => { this.logOut(e) }}>Log Out</a>
                </div>
            )
        }
        //if the user is not logged in (aka LogStatus = false), display link to login
        return (
            <div id="login-bar">
                <a className="login" href='/login'>Log In</a>
            </div>
        )
    }
}

export default LogBar
