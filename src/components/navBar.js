import React, { Component } from 'react';

class NavBar extends Component {
    render() {
        return (
            <div id="header" className="container-fluid">
                <div id="headRow" className="row">
                    <a className="co-link col-12" href="/">
                        <img id="logo" alt="company logo" src="https://bit.ly/3B6dgJ8" />
                    </a>
                    <div className="drop-down col-2" id="shop-drop">
                        <button id="drop-button">Dropdown</button>
                        <div className="dd-content">
                            <a className="dd-links" href="/">Specials</a><br></br>
                            <a className="dd-links" href="/products-page">All Items</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;