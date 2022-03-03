import React, { Component } from 'react';
import Axios from 'axios';
//gets URL query parameters for use in an api call for a specific item.
const params = new URLSearchParams(window.location.search)
//strings instead of arrays because only 1 listing should ever be shown.
class ListBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listing: {},
            cartConfirmation: { class: 'clear', message: 'none' },
            imgFocus: 0
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.saleCheck = this.saleCheck.bind(this)
        this.cartOnClick = this.cartOnClick.bind(this)
        this.imagesHandler = this.imagesHandler.bind(this)
    }
    /*fetches the relevant API as specified in the query
    and puts its data into the state to be rendered*/
    async componentDidMount() {
        //fetches the specific listing for the single page
        try {
            let response = await Axios.get("/listing?id=".concat(params.get('id')))
            this.setState({
                listing: response.data[0]
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
        this.props.AddtoCart(listing)
        /*this cartConfirmation state object conditionally changes the class of the 
        confirmation bar when an add to cart button is pressed*/
        this.setState({
            cartConfirmation: { class: 'confirmation', message: `The ${listing.name} has been added to your cart` }
        })
        //timeout to make the confirmation message last 5 seconds
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', message: 'none' }
        })), 5000)
    }
    saleCheck(original, discount) {
        //shows sale or original price for a listing depending on its sale status
        if (this.state.listing.sale) {
            return (
                <div>
                    <h5 className="sing-price crossed">${original}</h5>
                    <h5 id="sale-price" className="sing-price">${discount}</h5>
                </div>
            )
        }
        return (
            <div>
                <h5 className="sing-price">${original}</h5>
            </div>
        )
    }
    imagesHandler(pictures) {
        let thumbOnClick = (i) => {
            this.setState({
                imgFocus: i
            })
        }
        let displayClass = (i) => {
            if (i == this.state.imgFocus) {
                return "full-img"
            }
            return "clear"
        }
        let imageMapper = () => {
            if (pictures) {
                return (
                    <>
                        {pictures.map((pic, i) => (
                            <>
                                <img src={pic} key={"big".concat(i)} className={displayClass(i)} alt="Image failed to load" />
                            </>
                        ))}
                    </>
                )
            }
            else { return console.log("pictures not here yet") }
        }
        let thumbMapper = () => {
            if (pictures) {
                return (
                    <>
                        {pictures.map((pic, i) => (
                            <>
                                <button className="thumb-button" onClick={() => { thumbOnClick(i) }}>
                                    <img src={pic} key={"small".concat(i)} className="thumbnail" alt="oops" />
                                </button>
                            </>
                        ))}
                    </>
                )
            }
            else {return console.log("pictures not here yet")}
        }
        //controls which image is displayed depending on which one is clicked by the user
        return (
            <div id="image-handler">
                <div className="image-display">
                    {imageMapper()}
                </div>
                <div className="image-selector">
                    {thumbMapper()}
                </div>
            </div>
        )
    }
    render() {
        //some abbreviations for using throughout the render function
        let confirm = this.state.cartConfirmation
        return (
            <div>
                <div className={confirm.class}>
                    <h1>{confirm.message}</h1>
                </div>
                <h1 className="feat-text item-text">{this.state.listing.name}</h1>
                <div className="sing-listing">
                    {/*Creates a layout for displaying any number of images*/}
                    {this.imagesHandler(this.state.listing.picture)}
                    <div id="single-middle">
                        <p className="description">{this.state.listing.description}
                        </p>
                    </div>
                    <div className="right-side">
                        <div className="price-cart">
                            {this.saleCheck(this.state.listing.ogPrice, this.state.listing.disPrice)}
                            <button className="add-cart-single" onClick={() => { this.cartOnClick(this.state.listing) }}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListBody;
