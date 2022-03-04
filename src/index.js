import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LogBar from './components/logbar'
import NavBar from './components/navBar';
import HomeBody from './components/homeBody';
import Footer from './components/footer';
import MainLoading from './loadingcomponents/mainLoading';
import populateCart from "./functions/cartPopulation";
import Axios from "axios";


class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [{ name: "The Cart Is empty" }],
            logStatus: false,
            loading: true
        }
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
    cartLogout() {
        /*after logging the account out, this loads any potential previous cart
        linked to user session or if there is none, an empty cart*/
        this.componentDidMount();
    }
    //handles add to cart buttons in the body of the page.
    handleCartAdd(listing) {
        let newCart = this.state.cart
        if (newCart.length == 0) { }
        /*if the new cart [0] object contains less than 5 keys, remove it as it is
        an empty cart placeholder */
        else if (Object.keys(this.state.cart[0]).length < 5) {
            newCart.splice(0, 1)
        }
        listing.quantity = 1
        for (let i = 0; i < newCart.length; i++) {
            if (newCart[i]._id == listing._id) {
                newCart[i].quantity = newCart[i].quantity + 1
                this.setState({ cart: newCart })
                this.serverCartAdd(listing._id, newCart[i].quantity)
                return
            }
        }
        newCart.push(listing)
        this.setState({ cart: newCart })
        this.serverCartAdd(listing._id, listing.quantity)
        return
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
                <>
                    <LogBar logout={this.cartLogout} />
                    <NavBar cart={this.state.cart} />
                    <MainLoading />
                </>
            )
        }
        return (
            <>
                <LogBar logout={this.cartLogout} />
                <NavBar cart={this.state.cart} />
                <HomeBody parentCall={this.handleCartAdd} />
                <Footer />
            </>
        )
    }
}

ReactDOM.render(
    <>
        <HomePage />
    </>,
    document.getElementById("root"));