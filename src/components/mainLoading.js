import React, { Component } from 'react';

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