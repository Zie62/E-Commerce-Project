import React, { Component } from 'react';
import Axios from 'axios';


class FullList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listings: [],
            cartConfirmation: { class: 'clear', message: 'none' }
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.listingsMap = this.listingsMap.bind(this)
        this.cartOnClick = this.cartOnClick.bind(this)
    }
    async componentDidMount() {
        try {
            //retrieves all the items then sets the state.listings = those listings
            let response = await Axios.get("/full-db")
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
        /*these change the class and text of a banner to confirm items being added
        to the cart, then causes it to disappear. */
        this.setState({
            cartConfirmation: { class: 'confirmation', message: `The ${listing.name} has been added to your cart` }
        })
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', message: 'none' }
        })), 5000)
    }
    listingsMap() {
        /*checks sale status of each item and returns appropriate CSS classes. */
        let saleCheck = (sale, discount) => {
            /*if the item is on sale, display discounted price properly
            if it is not, display original price properly*/
            if (sale && discount || !sale && !discount) {
                return "feat-price"
            }
            //if the item is on sale but it is not the discount price being checked, cross out the original price
            else if (sale && !discount){
                return "feat-price crossed"
            }
            //if the item is not on sale, do not display the discount price
            else if(discount){
                return "clear"
            }
        }
        return (
            //maps the zipper array into individual UI elements to be rendered. 
            <div>
                {this.state.listings.map((listing, i) => (
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
                            <h2 className={saleCheck(listing.sale, false)}>${listing.ogPrice}</h2>
                            <h2 className={saleCheck(listing.sale, true)}>${listing.disPrice}</h2>
                        </div>
                        <button className="add-cart" onClick={() => { this.cartOnClick(listing) }}>Add to Cart</button>
                    </div>
                ))}
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
                <h1 className="feat-text">All Clothes</h1>
                <div className="feat-package">
                    {this.listingsMap()}
                </div>
            </div>
        )
    }
}
export default FullList;
