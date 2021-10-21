import React, { Component } from 'react';

const Logo = "https://ravenandmacaw.com/wp-content/uploads/2021/07/company-logo.png"
class NavBar extends Component {
    render() {
        return (
            <div id="header" className="container-fluid">
                <div id="headRow" className="row">
                    <a className="co-link col-2" href="#">
                        <img id="logo" alt="company logo" src={Logo} /></a>
                    <h1 id="title" className="col-10">COMPANY</h1>
                    <div className="drop-down col-4" id="shop-drop">
                        <button id="dd1">Dropdown</button>
                        <div className="dd-content">
                            <a className="dd-links" href="#">Specials</a><br></br>
                            <a className="dd-links" href="#">All Items</a>
                        </div>
                    </div>
                    <h2 id="dd2" className="col-4 hotbar"></h2>
                    <h2 id="info" className="col-4 hotbar">About Us</h2>
                </div>
            </div>
        )
    }
}

export default NavBar;