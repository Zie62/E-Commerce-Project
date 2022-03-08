import Axios from 'axios';
import React, { Component } from 'react';
import Decimalizer from '../functions/decimalizer';

class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }
        this.itemsDisplay = this.itemsDisplay.bind(this)
        this.totalCalculations = this.totalCalculations.bind(this)
        this.loading = this.loading.bind(this)
        this.checkOut = this.checkOut.bind(this)
    }
    loading(status) {
        /*returns either a class with display:none or no class depending on loading 
        status and which entry is being displayed.*/
        if (status && this.state.loaded){
            return ""
        }
        else if (!status && this.state.loaded){
            
            return "clear"
        }
        else if (status && !this.state.loaded){
            return "clear"
        }
        else{
            setTimeout(() => {
                this.setState({
                    loaded:true
                })
            }, 5000);
            return ""
        }
    }
    async checkOut(e){
        e.preventDefault();
        let results = await Axios.post("/checkout");
        if (results){
            location.href = "https://no-rscripts.herokuapp.com"
        }
        else{
            console.log("Was not checked out :(")
        }
    }
    itemsDisplay() {
        /*if the cart has an object at index 0 that does not have adequite keys (meaning it is a placeholder),
        return loading text for 5 seconds, then tell the user it appears the cart is empty. This is no longer relevant
        once the cart is loaded from the API call.*/
        if (Object.keys(this.props.cart[0]).length < 5) {
            return (
                <div>
                    <h1 className={this.loading(false)}>loading...</h1>
                    <h1 className={this.loading(true)}>It appears your cart is empty or still loading. If not, do you have cookies disabled?</h1>
                </div>
            )
        }
        let saleCheck = (listing) => {
            //listing[2] original price listing[3] discounted price
            //listing[6] is the sale indicator which is a boolean.
            if (listing.sale) {
                return listing.disPrice
            }
            return listing.ogPrice
        }
        //maps the cart from the props
        return (
            <>
                {this.props.cart.map((listing, i) => (
                    <div className="cart-item" key={i}>
                        <a href={"/item?id=".concat(listing._id)} className="cart-links">
                            <img className="cart-img" src={listing.picture[0]} />
                        </a>
                        <div id="cart-text">
                            <a href={"/item?id=".concat(listing._id)} className="cart-links">
                                <h2 className="cart-name big-cart-name">{listing.name}</h2>
                            </a>
                            {/*change the cart prices div to be conditional to the sale
                            of the given item.*/}
                            <div className="cart-prices">
                                <h2 className="cart-page-price">{saleCheck(listing)}</h2>
                            </div>
                        </div>
                        <div className='quantity-handlers'>
                            <div className="counter">
                                <button className="increment-buttons minus" onClick={() => this.props.updater(listing, "-")}>-</button>
                                <h2 className="quantity">{listing.quantity}</h2>
                                <button className="increment-buttons plus" onClick={() => this.props.updater(listing, "+")}>+</button>
                            </div>
                            <div className="remover">
                                <button className="remove" onClick={() => this.props.updater(listing, 'delete')}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    }
    totalCalculations() {
        //prices and price calculations are not shown if the cart contains a placeholder.
        if (Object.keys(this.props.cart[0]).length < 5) {
            return (<div></div>)
        }
        let userCart = this.props.cart
        let subTotal = 0
        let discount = 0
        for (let i = 0; i < userCart.length; i++) {
            /*[i] is the index of the current cart item and 2/3 are the
            original and sale prices respectively. 6 is the sale boolean
            which expresses whether or not an item is on sale, 5 is the quantity
            of that item*/
            //replace removes the . from the string to allow it to be parsed as an integer for calculations
            if (userCart[i].sale) {
                discount += ((parseInt((userCart[i].ogPrice).replace(".", "")) - parseInt((userCart[i].disPrice).replace(".", "")))  * userCart[i].quantity)
                subTotal += (parseInt((userCart[i].disPrice).replace(".", "")) * userCart[i].quantity)
            }
            else { subTotal += (parseInt((userCart[i].ogPrice).replace(".", "")) * userCart[i].quantity) }
        }
        //parses the subtotal * .06 tax rate 
        let salesTax = parseInt(subTotal * 0.06)
        if (subTotal == 0) {
            salesTax = 0
        }
        /*Decimalizer takes the integer values which represent total cents and turns them into
        a string which takes the format of money ($$$$.¢¢)*/
        let total = Decimalizer((subTotal + salesTax));
        subTotal = Decimalizer(subTotal);
        if(!discount){
            discount = "0.00"
        }
        else{
        discount = Decimalizer(discount);
        }
        salesTax = Decimalizer(salesTax);
        return (
            <div id="totals">
                <div id="calculations" key={this.props.cart}>
                    <p id="discounts">Total Saved: ${discount}</p>
                    <p id="subtotalDiscounted">Subtotal: ${subTotal}</p>
                    <p id="salesTax">Estimated Sales Tax(6%): ${salesTax}</p>
                </div>
                <div>
                    <p id="total">Total: ${total}</p>
                    <button className="add-cart" onClick={(e) => this.checkOut(e)}>Checkout</button>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="cart-page">
                <h1 className="feat-text">Cart</h1>
                <div id="cart-body">
                    <div className="cart" key={this.props.cart}>
                        {this.itemsDisplay()}
                    </div>
                    <div className="cart-summary">
                        {this.totalCalculations()}
                    </div>
                </div>
                <h2 className="disclaimer">For all intents and purposes, this site is
                    a web project. The checkout button does not work and redirects to the home
                    page. I do not own any of the images used, nor do I intend to use this
                    site for the sale of any products or the redistribution of any of
                    these images.</h2>
            </div>
        )
    }
}

export default Cart;