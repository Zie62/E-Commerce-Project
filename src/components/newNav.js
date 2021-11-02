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
                    <div className="dropdown-bar">≡</div>
                    <div className="dropdown-contents">
                        <a href="#" className="dropdown-item">Specials</a>
                        <a href="#" className="dropdown-item">All Clothes</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;
