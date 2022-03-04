import React, { Component } from 'react';
import Axios from 'axios';

class HomeBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listings: [],
            cartConfirmation: { class: 'clear', message: 'none' }
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.featLoader = this.featLoader.bind(this)
        this.cartOnClick = this.cartOnClick.bind(this)
    }
    async componentDidMount() {
        try {
            let response = await Axios.get("/sale-db")
            this.setState({
                listings: response.data
            })
        }
        catch {
            //if for some reason the axios call cannot work, this shows an error message in a banner
            this.setState({
                cartConfirmation: { class: "confirmation", message: "The page has failed to load. Please try again, or come back later." }
            })
        }
    }
    cartOnClick(listing) {
        /*props function to pass the cart up to the parent state, which is then synced 
        across child components*/
        this.props.parentCall(listing)
        this.setState({
            cartConfirmation: { class: 'confirmation', message: (`The ${listing.name} was added to your cart`) }
        })
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', message: 'none' }
        })), 5000)
    }
    featLoader() {
        /* This div has className width100 because for some reason it was defaulting to ~60% width
        despite the same structure not doing that on the products page. Still unsure what caused it,
        but I do know what fixed it.*/
        return (
            <div className="width100"> {
                this.state.listings.map((listing, i) => (
                    <div className="feat-box" key={i}>
                        <a href={"/item?id=".concat(listing._id)} className="feat-link">
                            <img src={listing.picture[0]} alt="image not loading" className="feat-img" />
                        </a>
                        <div className="feat-not-img">
                            <a href={"/item?id=".concat(listing._id)} className="feat-link">
                                <h2 className="feat-name">{listing.name}</h2>
                            </a>
                        </div>
                        <div id="prices" className="feat-not-img">
                            <h2 className="feat-price crossed">${listing.ogPrice}</h2>
                            <h2 className="feat-price">${listing.disPrice}</h2>
                        </div>
                        <button className="add-cart" onClick={() => { this.cartOnClick(listing) }}>Add to Cart</button>
                    </div>
                ))
            }
            </div>
        )
    }
    render() {
        let confirm = this.state.cartConfirmation
        return (
            <div className="display-body">
                <div className={confirm.class}>
                    <h1>{confirm.message}</h1>
                </div>
                <h1 className="feat-text">Featured Deals</h1>
                <div className="feat-package">
                    {/*This calls a function which maps the state imported from the 
                        database sale API on component mount into HTML elements to be
                         shown to the user*/}
                    {this.featLoader()}
                </div>
            </div>
        )
    }
}

export default HomeBody;
