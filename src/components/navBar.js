import React, { Component } from 'react';

class NavBar extends Component {
    render() {
        return (
            <div id="header" className="container-fluid">
                <div id="headRow" className="row">
                    <a className="co-link col-8" href="/">
                        <img id="logo" alt="company logo" src="https://bit.ly/3B6dgJ8" />
                    </a>
                    <div className="drop-down col-4" id="cloth-drop">
                        <button id="drop-button">Clothes</button>
                        <div className="dd-content">
                            <a className="dd-links" href="/">Specials</a><br></br>
                            <a className="dd-links" href="/products-page">All Clothes</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;