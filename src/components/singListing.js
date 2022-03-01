import React, { Component } from 'react';
import Axios from 'axios';
//gets URL query parameters for use in an api call for a specific item.
const params = new URLSearchParams(window.location.search)
//strings instead of arrays because only 1 listing should ever be shown.
class ListBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            pic: [],
            ogPrice: "",
            disPrice: "",
            sale: false,
            description: "",
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
            let data = response.data[0]
            this.setState({
                name: data.name,
                pic: data.picture,
                ogPrice: data.ogPrice,
                disPrice: data.disPrice,
                id: data._id.toString(),
                sale: data.sale,
                description: data.description
            })
        }
        catch {
            //displays an error message if the item information cannot be retrieved.
            this.setState({
                cartConfirmation: { class: "confirmation", message: "Item failed to load. Please try again or come back later." }
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
            cartConfirmation: { class: 'confirmation', message: `The ${listing[0]} has been added to your cart` }
        })
        //timeout to make the confirmation message last 5 seconds
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', message: 'none' }
        })), 5000)
    }
    saleCheck(original, discount) {
        //shows sale or original price for a listing depending on its sale status
        if (this.state.sale) {
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
        let thumbMapper = () => {
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
        let listing = [this.state.name, this.state.pic, this.state.ogPrice, this.state.disPrice, this.state.id]
        let confirm = this.state.cartConfirmation
        return (
            <div>
                <div className={confirm.class}>
                    <h1>{confirm.message}</h1>
                </div>
                <h1 className="feat-text item-text">{this.state.name}</h1>
                <div className="sing-listing">
                    {/*Creates a layout for displaying any number of images*/}
                    {this.imagesHandler(this.state.pic)}
                    <div id="single-middle">
                        <p className="description">{this.state.description}
                        </p>
                    </div>
                    <div className="right-side">
                        <div className="price-cart">
                            {this.saleCheck(this.state.ogPrice, this.state.disPrice)}
                            <button className="add-cart-single" onClick={() => { this.cartOnClick(listing) }}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListBody;
