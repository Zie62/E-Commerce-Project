import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import FullStock from './components/fullStock';
import Footer from './components/footer';
import LogBar from './components/logbar';
import MainLoading from "./loadingcomponents/mainLoading";
import populateCart from "./functions/cartPopulation";
import Axios from 'axios';

class FullPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [{name: "the cart is empty"}],
            logStatus: false,
            loading: true
        }
        this.handleCartAdd = this.handleCartAdd.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.cartLogout = this.cartLogout.bind(this)
        this.serverCartAdd = this.serverCartAdd.bind(this)
    }
    async componentDidMount() {
        const newCart = await populateCart();
        this.setState({
            cart: newCart,
            loading:false
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
        /*if the first object in the cart does not contain a full set of keys (Meaning it is a 
            placeholder) delete that before adding an item.*/
        if (Object.keys(newCart[0]).length < 5) {
            newCart.splice(0, 1)
        }
        /*this will add a quantity value to the listing object to be utilized if the item does
        not already exist within the users cart.*/
        listing.quantity = 1
        for (let i = 0; i < newCart.length; i++) {
            if (newCart[i]._id == listing._id) {
                /*if the item exists in the cart, add 1 to its quantity then push the update
                to their local cart and their database cart*/
                newCart[i].quantity = newCart[i].quantity + 1
                this.setState({ cart: newCart })
                this.serverCartAdd(listing._id, newCart[i].quantity)
                return
            };
        }
        /*if the item's id does not line up with an item contained within the cart,
         push it to the end and then update local cart and database cart*/
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
                <FullStock parentCall={this.handleCartAdd} />
                <Footer />
            </div>
        )
    }
}
ReactDOM.render(
    <div>
        <FullPage />
    </div>,
    document.getElementById("root"));
