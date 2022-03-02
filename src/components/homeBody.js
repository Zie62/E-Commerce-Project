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
        /*these comments are preparing for updating this system to use the objects
         they come in rather than splitting them into these arrays (i dont know why
            i did this 3 months ago, it was a terrible approach).*/
        //response.data = [{}, {}, ...] ; response.data[i] = {}
        //this.setState({listings: response.data})
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
        //sample code for updated structuring:
        // listing = {name, picture, ogPrice, disPrice, _id, sale}
        //     picture = ["", "", "", ...]
        console.log(this.state.listings)
        console.log(this.state.listings.map((listing, i) => {return listing.name}))
        return (
            <div> {
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
        //maps the state object to an array of arrays, where each one represents a listing
        // let zipper = this.state.names.map((name, i) => [name, this.state.pics[i], this.state.ogPrices[i], this.state.disPrices[i], this.state.ids[i]]);
        // return (
        //     /*each listing is constructed into a listing on the UI by mapping the zipper
        //      array above, which is a map of the state such that each array within zipper
        //      is a listing with each one of the relevant properties. indexing numbers are defined
        //      within the zipper array defined above.*/
        //     <div>
        //         {zipper.map((listing, i) => (
        //             <div className="feat-box" key={i}>
        //                 <a href={"/item?id=".concat(listing[4])} className="feat-link">
        //                     <img src={listing[1][0]} alt="image not loading" className="feat-img" />
        //                 </a>
        //                 <div className="feat-not-img">
        //                     <a href={"/item?id=".concat(listing[4])} className="feat-link">
        //                         <h2 className="feat-name">{listing[0]}</h2>
        //                     </a>
        //                 </div>
        //                 <div id="prices" className="feat-not-img">
        //                     <h2 className="feat-price crossed">${listing[2]}</h2>
        //                     <h2 className="feat-price">${listing[3]}</h2>
        //                 </div>
        //                 <button className="add-cart" onClick={() => { this.cartOnClick(listing) }}>Add to Cart</button>
        //             </div>
        //         ))}
        //     </div>
        //)
    }
    render() {
        let confirm = this.state.cartConfirmation
        return (
            <div className="display-body">
                <div className={confirm.class}>
                    <h1>{confirm.message}</h1>
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
