import React, { Component } from 'react';

class NavBar extends Component{
    render(){
        return(
            <div className="header">
                <div className="logo">
                    <a href="/new-design">
                    <img src="https://bit.ly/3B6dgJ8" className="logo" />
                    </a>
                </div>
                <div className="dropdown">
                    <button classname="dropdown-bar"></button>
                    <div className="dropdown-contents">
                        <a className="dropdown-item">Specials</a>
                        <a className="dropdown-item">All Clothes</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;
