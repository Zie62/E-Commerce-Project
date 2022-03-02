import "./app.css";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';
import ListBody from './components/singListing';
import Footer from './components/footer'
import LogBar from './components/logbar'
import singleLoading from './loadingcomponents/singleLoading';
import populateCart from "./functions/cartPopulation";
import Axios from 'axios';
import SingleLoading from "./loadingcomponents/singleLoading";

/*this array and get request populates a registry of all listings in the DB to be used
for populating the cart entries which come in a stripped down form from the database 
only carrying ID and quantity*/

class SingleListingDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [],
            loading: true
        }
        this.cartLogout = this.cartLogout.bind(this)
        this.handleCartAdd = this.handleCartAdd.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.serverCartAdd = this.serverCartAdd.bind(this)
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
        //checks if the cart is empty, as if it is the next conditional crashes the function
        console.log(listing)
        console.log(newCart)
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
