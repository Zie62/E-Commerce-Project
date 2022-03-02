import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LogBar from './components/logbar'
import NavBar from './components/navBar';
import HomeBody from './components/homeBody';
import Footer from './components/footer';
import MainLoading from './components/mainLoading';
import populateCart from "./functions/cartPopulation";
import Axios from "axios";


class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [["The cart is empty"]],
            logStatus: false,
            loading: true
        }
        this.initializeCart = this.initializeCart.bind(this)
        this.handleCartAdd = this.handleCartAdd.bind(this)
        this.serverCartAdd = this.serverCartAdd.bind(this)
        this.cartLogout = this.cartLogout.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    async componentDidMount() {
        const newCart = await populateCart();
        this.setState({
            cart: newCart,
            loading: false
        })
    }
    /*initializes the cart in the parent state to prevent an empty cart overwriting state
    of child elements*/
    initializeCart(cart) {
        if (cart == undefined) { return }
        this.setState({
            cart: cart
        })
    }
    cartLogout() {
        /*after logging the account out, this loads any potential previous cart
        linked to user session or if there is none, an empty cart*/
        this.componentDidMount();
    }
    //handles add to cart buttons in the body of the page.
    handleCartAdd(listing) {
        let newCart = this.state.cart
        //checks if the cart is empty, as if it is the next conditional crashes the function
        if (newCart.length == 0) { }
        /*if the new cart [0] is not an array of an item listing, (such as a string saying
        its empty), remove that to allow the cart to resume regular functionality*/
        else if (newCart[0].length < 5) {
            newCart.splice(0, 1)
        }
        /*this will add a counter value to the end of the listing array
        which i will use to maintain the number of a given item in the
        shopping cart*/
        listing.push(1)
        for (let i = 0; i < newCart.length; i++) {
            if (newCart[i].includes(listing[4])) {
                //5 is the index of the quantity of an item in the shopping cart
                newCart[i][5]++
                this.setState({ cart: newCart })
                //4 and 5 are the indexes of ObjectID and quantity within a given listing array
                this.serverCartAdd(newCart[i][4], newCart[i][5])
                return
            };
        }

        newCart.push(listing)
        this.setState({ cart: newCart })
        this.serverCartAdd(listing[4], listing[5])
    }
    serverCartAdd(id, quant) {
        //this posts the ObjectID of the item added to the cart as well as the new quantity
        Axios.post("/cart-add-now", {
            id: id,
            quantity: quant
        })
    }
    render() {
        if (this.state.loading) {
            return (
                <div>
                    <LogBar logout={this.cartLogout} />
                    <NavBar cart={this.state.cart} />
                    <MainLoading />
                </div>
            )
        }
        return (
            <div>
                <LogBar logout={this.cartLogout} />
                <NavBar cart={this.state.cart} />
                <HomeBody parentCall={this.handleCartAdd} />
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <HomePage />
    </div>,
    document.getElementById("root"));