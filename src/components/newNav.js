import React, { Component } from 'react';

class NavBar extends Component{
    render(){
        /*returns a top nav bar which contains a logo( links tohome page), company name,
        and a dropdown menu using a ≡ symbol*/
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
                        <br /><a href="#" className="dropdown-item">All Clothes</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;
