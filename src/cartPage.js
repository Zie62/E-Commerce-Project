import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import Cart from './components/cart';
import Footer from './components/footer';
import LogBar from './components/logbar';
import populateCart from './functions/cartPopulation';
import Axios from "axios";

class CartPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [['There is nothing in your cart. If this is wrong, please refresh after the page has finished loading.']],
            logStatus: false
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.updateCart = this.updateCart.bind(this)
        this.cartLogout = this.cartLogout.bind(this)
    }
    async componentDidMount() {
        const newCart = await populateCart();
        this.setState({
            cart: newCart
        })
    }
    cartLogout() {
        /*after logging the account out, this loads any potential previous cart
        linked to user session or if there is none, an empty cart*/
        this.componentDidMount();
    }
    updateCart(newListing, operation) {
        let localIndex = this.state.cart.indexOf(newListing)
        //if the + button is pressed, this adds to the quantity of the item
        if (operation == "+") {
            //quantity of an item within the listing array structure is at index 5.
            newListing[5]++
        }
        //handles delete operations using the "remove" button on the cart page.
        else if (operation == 'delete') {
            let newCart = this.state.cart
            /*if the newCart length is 1 and that single item is being removed, this handles
            making the cart empty on the database and showing an empty cart message*/
            if (newCart.length == 1) {
                newCart = []
                this.setState({
                    cart: [['There is nothing in your cart. If this is wrong, please refresh after the page has finished loading.']]
                })
                //posts the new, empty cart to the database
                Axios.post(
                    "/cart-delete-now", {
                    cart: newCart
                }
                )
                return
            }
            /*if the item being removed is not the last item, this splices it out then
            sets the state with the new cart*/
            else { newCart.splice(localIndex, 1) }
            this.setState({
                cart: newCart
            })
            Axios.post(
                "/cart-delete-now", {
                cart: newCart
            }
            )
            return
        }
        /*The only remaining operation is the minus button, so this subtracts from the
        item if that button is pressed*/
        else {
            newListing[5]--
        }
        let newCart = this.state.cart
        /*if this makes quantity 0, this removes the item from the cart and handles
        database and UI updating*/
        if (newListing[5] <= 0) {
            newCart.splice(localIndex, 1);
            if (newCart.length == 0) {
                Axios.post(
                    "/cart-delete-now", {
                    cart: newCart
                }
                )
                this.setState({
                    cart: [['There is nothing in your cart. If this is wrong, please refresh after the page has finished loading.']]
                })
                return
            }
        }
        else {
            newCart[localIndex] = newListing
        }
        this.setState({
            cart: newCart
        })
        /*last check to make sure the quantity of an item is greater than 0 and 
         updates the database accordingly*/
        if (newListing[5] > 0) {
            Axios.post(
                "/cart-add-now", {
                id: newListing[4],
                quantity: newListing[5]
            }
            )
        }
        else {
            Axios.post("/cart-delete-now", {
                cart: newCart
            })
        }
    }
    render() {
        return (
            //renders the child elements with parent cart passed down as props.
            <div>
                <LogBar logout={this.cartLogout} />
                <NavBar cart={this.state.cart} />
                <Cart cart={this.state.cart} updater={this.updateCart} />
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(
    <CartPage />,
    document.getElementById('root')
)
