import React, { Component } from 'react';
/*This component is loaded before the users cart or the actual item data is loaded on
the single listing page. This is done to allow for a contenful paint more quickly
on slower networks so the user is not staring at what seems to be nothing more than an
unpopulated page. Conveys that the page is loading, and they just have to wait a bit.
Improves first contentful paint by about 5 seconds on slow 3g throttle setting. (chrome
dev tools) */
class SingleLoading extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        //This mimics the structure of the single listing page but in grey blocks.
        return (
            <div>
                <h2 className="feat-text">Loading...</h2>
                <div className="sing-listing">
                    <div className="skeleton image-display"></div>
                    <div className="single-middle skeleton"></div>
                    <div className="right-side skeleton"></div>
                </div>
            </div>
        )
    }
}
export default SingleLoading