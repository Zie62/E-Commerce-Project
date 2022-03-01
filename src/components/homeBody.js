import React, { Component } from 'react';
import Axios from 'axios';

class HomeBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            names: [],
            pics: [],
            ogPrices: [],
            disPrices: [],
            ids: [],
            cartConfirmation: { class: 'clear', item: 'none' }
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.featLoader = this.featLoader.bind(this)
        this.cartOnClick = this.cartOnClick.bind(this)
    }
    componentDidMount() {
        /*axios gets a REST api which responds with a JSON object containing all
        listing items which are on sale. I then use a for loop to organize the
        JSON object into categories to be put in the state and referenced later.*/
        Axios.get("/sale-db").then((response) => {
            var nameList = []
            var picList = []
            var ogPrices = []
            var disPrices = []
            var idList = []
            for (let i = 0; i < response.data.length; i++) {
                let listing = response.data[i]
                nameList.push(listing.name)
                picList.push(listing.picture)
                ogPrices.push(listing.ogPrice)
                disPrices.push(listing.disPrice)
                /*used to make URL's for each listing, referencing the ObjectID from the 
                database. I turn them into strings to be concatenated later*/
                idList.push(listing._id.toString())
            }
            this.setState({
                names: nameList,
                pics: picList,
                ogPrices: ogPrices,
                disPrices: disPrices,
                ids: idList
            })
        });
    }
    cartOnClick(listing) {
        /*props function to pass the cart up to the parent state, which is then synced 
        across child components*/
        this.props.parentCall(listing)
        this.setState({
            cartConfirmation: { class: 'confirmation', item: listing[0] }
        })
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', item: 'none' }
        })), 5000)
    }
    featLoader() {
        //maps the state object to an array of arrays, where each one represents a listing
        let zipper = this.state.names.map((name, i) => [name, this.state.pics[i], this.state.ogPrices[i], this.state.disPrices[i], this.state.ids[i]]);
        return (
            /*each listing is constructed into a listing on the UI by mapping the zipper
             array above, which is a map of the state such that each array within zipper
             is a listing with each one of the relevant properties. indexing numbers are defined
             within the zipper array defined above.*/
            <div>
                {zipper.map((listing, i) => (
                    <div className="feat-box" key={i}>
                        <a href={"/item?id=".concat(listing[4])} className="feat-link">
                            <img src={listing[1][0]} alt="image not loading" className="feat-img" />
                        </a>
                        <div className="feat-not-img">
                            <a href={"/item?id=".concat(listing[4])} className="feat-link">
                                <h2 className="feat-name">{listing[0]}</h2>
                            </a>
                        </div>
                        <div id="prices" className="feat-not-img">
                            <h2 className="feat-price crossed">${listing[2]}</h2>
                            <h2 className="feat-price">${listing[3]}</h2>
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
                    <h1>The {confirm.item} has been added to your cart</h1>
                </div>
                <h2 className="feat-text">Featured Deals</h2>
                <div className="feat-package">
                    {/*This calls a function which maps the state imported from the 
                        database sale API on component mount into HTML elements to be
                         shown to the enduser*/}
                    {this.featLoader()}
                </div>
            </div>
        )
    }
}

export default HomeBody;
