import React, { Component } from 'react';

class Footer extends Component {
    constructor() {
        super()
    }
    render() {
        //footer for the purpose of not having a naked bottom of the page
        return (
            <div id="footer">
                <p className="footer-p">This is where i would put links like support, terms of service, and site policies
                    alongside social media links. I dont think it makes sense to make them for this
                    project, but this will serve to have a scroll to top button </p>
                <a href="https://github.com/Zie62/React_webpack"><p className="footer-p">Github Repository</p></a>
                <button id="scroll-button" onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }) }}>
                    Scroll to Top
                </button>
            </div>
        )
    }
}

export default Footer;