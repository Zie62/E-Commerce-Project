import React, { Component } from 'react';
import Axios from 'axios';
//gets the query such that the ID of the item to be rendered can be referenced from the database.
const queryStr = window.location.search.substr(1);
var queryParams = queryStr.split("&").reduce((current, param) => {
    const [key, value] = param.split('=');
    current[key] = value;
    return current
}, {})
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
            cartConfirmation: { class: 'clear', item: 'none' },
            imgFocus: 0
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.saleCheck = this.saleCheck.bind(this)
        this.cartOnClick = this.cartOnClick.bind(this)
        this.imagesHandler = this.imagesHandler.bind(this)
    }
    /*fetches the relevant API as specified in the query
    and puts its data into the state to be rendered*/
    componentDidMount() {
        //fetches the specific listing for the single page
        let queryId = "/listing?id=".concat(queryParams.id)
        Axios.get(queryId).then((response) => {
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
        })
    }
    cartOnClick(listing) {
        /*props function to pass the cart up to the parent state, which is then synced 
        across child components*/
        this.props.AddtoCart(listing)
        /*this cartConfirmation state object conditionally changes the class of the 
        confirmation bar when an add to cart button is pressed*/
        this.setState({
            cartConfirmation: { class: 'confirmation', item: listing[0] }
        })
        //timeout to make the confirmation message last 5 seconds
        setTimeout((() => this.setState({
            cartConfirmation: { class: 'clear', item: 'none' }
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
                    <h1>The {confirm.item} has been added to your cart</h1>
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
