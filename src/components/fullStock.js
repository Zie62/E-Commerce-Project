import React, { Component } from 'react';
import Axios from 'axios';


class FullList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            names: [],
            pics: [],
            ogPrices: [],
            disPrices: [],
            ids: [],
            sales: [],
            cartConfirmation: { class: 'clear', message: 'none' }
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.listingsMap = this.listingsMap.bind(this)
        this.cartOnClick = this.cartOnClick.bind(this)
    }
    async componentDidMount() {
        /*this axios function calls my /full-db REST API then passes the JSON to a nameless 
        function which puts the relevant data into the state to be referenced every time the
        web page is opened*/
        try {
            let response = await Axios.get("/full-db")
            var nameList = []
            var picList = []
            var ogPrices = []
            var disPrices = []
            var idList = []
            var salesList = []
            for (let i = 0; i < response.data.length; i++) {
                let listing = response.data[i]
                nameList.push(listing.name)
                picList.push(listing.picture)
                ogPrices.push(listing.ogPrice)
                disPrices.push(listing.disPrice)
                idList.push(listing._id.toString())
                salesList.push(listing.sale)
            }
            this.setState({
                names: nameList,
                pics: picList,
                ogPrices: ogPrices,
                disPrices: disPrices,
                ids: idList,
                sales: salesList
            })
        }
        catch {
            this.setState({
                cartConfirmation: {class: "confirmation", message: "The page has failed to load. Either retry, or try again later."}
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
            cartConfirmation: { class: 'confirmation', message: `The ${listing[0]} has been added to your cart` }
        })
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', message: 'none' }
        })), 5000)
    }
    listingsMap() {
        /*listings turns the state into an array of arrays where each one represents
        a listing to be displayed on the webpage. */
        let listings = this.state.names.map((name, i) => [name, this.state.pics[i], this.state.ogPrices[i], this.state.disPrices[i], this.state.ids[i]]);
        /*checks sale status of each item at index i and returns a */
        let crossCheck = (i) => {
            if (this.state.sales[i]) {
                return "feat-price crossed"
            }
            return "feat-price"
        }
        let saleCheck = (i) => {
            if (this.state.sales[i]) {
                return "feat-price"
            }
            return "clear"
        }
        return (
            //maps the zipper array into individual UI elements to be rendered. 
            <div>
                {listings.map((listing, i) => (
                    <div className="feat-box" key={i}>
                        <a href={"/item?id=".concat(listing[4])} className="feat-link">
                            <img src={listing[1][0]} alt="oopsies" className="feat-img" />
                        </a>
                        <div className="feat-not-img">
                            <a href={"/item?id=".concat(listing[4])} className="feat-link">
                                <h2 className="feat-name">{listing[0]}</h2>
                            </a>
                        </div>
                        <div id="prices" className="feat-not-img">
                            <h2 className={crossCheck(i)}>${listing[2]} </h2>
                            <h2 className={saleCheck(i)} >${listing[3]}</h2>
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
