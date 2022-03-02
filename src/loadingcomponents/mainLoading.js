import React, { Component } from 'react';
/*This component is loaded before the users cart or the actual item data is loaded on
the sales and products page. This is done to allow for a contenful paint more quickly
on slower networks so the user is not staring at what seems to be nothing more than an
unpopulated page. Conveys that the page is loading, and they just have to wait a bit.
Improves first contentful paint by about 5 seconds on slow 3g throttle setting. (chrome
dev tools) */
class MainLoading extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        /*this is used to make 6 copies of these skeleton objects 
        to populate the page during loading*/
        const copies = [1, 2, 3, 4, 5, 6]
        return (
            <div className="display-body">
                <h2 className="feat-text">Loading...</h2>
                {
                    copies.map((copy, i) => (
                        <div className="feat-box" key={i}>
                            <div className="skeleton skele-img"></div>
                            <div className="skele-text skeleton"></div>
                            <div className="skele-prices">
                                <div className="skele-price skeleton"></div>
                                <div className="skele-price skeleton"></div>
                            </div>
                            <div className="skeleton skele-btn"></div>
                        </div>
                    ))
                }
            </div>
        )
    }
}
export default MainLoading