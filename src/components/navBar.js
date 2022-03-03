import React, { Component } from 'react';

//gets the query and splits it into the "current" object as key value pairs to be returned
class NavBar extends Component {
    constructor(props) {
        super(props)
        this.cartUI = this.cartUI.bind(this)
    }
    //handles the building of the cart UI based on the current parent state
    cartUI() {
        /*checks if the cart contains only a placeholder error message rather than 
        an actual item listing.*/
        if (Object.keys(this.props.cart[0]).length < 8) {
            // returns strings expressing the cart is empty if that is the case.
            return (
                <div>
                    <h1 id="empty-cart">{this.props.cart[0].name}</h1>
                </div>
            )
        }
        let saleMaker = (listing) => {
            //listing.sale gives the sale status as a boolean
            /*Sale status is not required in the listing schema, 
            but is added during sale turnover at midnight unix, so this 
            makes sure if it has not had a sale value assigned it will
            not crash the page.*/
            if (listing.sale === undefined) {
                return (
                    <div>
                        <h2 className="cart-price">{listing.ogPrice}</h2>
                    </div>)
            }
            else if (listing.sale) {
                //2 and 3 are the indexs of original and sale prices respectively.
                return (
                    <div>
                        <h2 className="cart-price crossed">${listing.ogPrice}</h2>
                        <h2 className="cart-price">${listing.disPrice}</h2>
                    </div>
                )
            }
            return (<div>
                <h2 className="cart-price">{listing.ogPrice}</h2>
            </div>)
        }
        /*maps each listing in the cart to a cart-item which contains the image, price,
        name, and quantity in cart of that item.*/
        return (
            <div>
                {this.props.cart.map((listing, i) => (
                    <div className="cart-item" key={i}>
                        <a href={"/item?id=".concat(listing._id)} className="cart-links">
                            <img className="cart-img" src={listing.picture[0]} />
                        </a>
                        <div id="cart-text">
                            <a href={"/item?id=".concat(listing._id)} className="cart-links">
                                <h4 className="cart-name">{listing.name}</h4>
                            </a>
                            <div className="cart-prices">
                                {saleMaker(listing)}
                            </div>
                        </div>
                        <div className="counter dd-counter">
                            <h5 className="quantity">{listing.quantity}</h5>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    render() {
        /*returns a top nav bar which contains a logo(links to home page), company name,
         a dropdown menu using a ≡ symbol, and a cart denoted using a cart emoji*/
        return (
            <div id="header">
                <div className="logo-div">
                    <a href="/">
                        <img src="https://bit.ly/3Dit39t" className="logo" alt="Company Logo" />
                    </a>
                </div>
                <div className="cart-drop" key={this.props.cart}>
                    <a id="cart-icon-link" href="/cart"><h1 id="cart-icon">🛒</h1></a>
                    <div className="cart-contents" key={this.props.cart}>
                        {this.cartUI()}
                    </div>
                </div>
                <div className="dropdown">
                    <h1 className="dropdown-bar">≡</h1>
                    <div className="dropdown-contents">
                        <a href="/" className="dropdown-item">Specials</a>
                        <a href="/products-page" className="dropdown-item">All Clothes</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;
