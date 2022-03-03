import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import ListBody from './components/singListing';
import Footer from './components/footer'
import LogBar from './components/logbar'
import SingleLoading from './loadingcomponents/singleLoading';
import populateCart from "./functions/cartPopulation";
import Axios from 'axios';

/*this array and get request populates a registry of all listings in the DB to be used
for populating the cart entries which come in a stripped down form from the database 
only carrying ID and quantity*/

class SingleListingDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [{name: "Cart is empty"}],
            loading: true
        }
        this.cartLogout = this.cartLogout.bind(this)
        this.handleCartAdd = this.handleCartAdd.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.serverCartAdd = this.serverCartAdd.bind(this)
    }
    async componentDidMount() {
        const newCart = await populateCart();
        console.log("This is newCart in parent js file")
        console.log(newCart)
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
            if (newCart[i]._id = listing._id) {
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
                <div>
                    <LogBar logout={this.cartLogout} />
                    <NavBar cart={this.state.cart} />
                    <SingleLoading />
                </div>
            )
        }
        return (
            <div>
                <LogBar logout={this.cartLogout} />
                <NavBar cart={this.state.cart} />
                <ListBody AddtoCart={this.handleCartAdd} />
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <SingleListingDisplay />
    </div>,
    document.getElementById('root'));
