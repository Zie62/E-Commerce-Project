import './app.css'
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import LogBar from './components/logbar';
import NavBar from './components/navBar';
import Orders from './components/orders';
import Footer from './components/footer';
import populateCart from './functions/cartPopulation';


class AccountPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: [["Cart is empty"]]
        }
        this.cartLogout = this.cartLogout.bind(this)
    }
    async componentDidMount() {
        let newCart = await populateCart();
        this.setState({
            cart: newCart
        })
    }
    cartLogout() {
        /*after logging the account out, this loads any potential previous cart
        linked to user session or if there is none, an empty cart*/
        this.componentDidMount();
    }
    render() {
        return (
            <>
                <LogBar logout={this.cartLogout} />
                <NavBar cart={this.state.cart} />
                <Orders />
                <Footer />
            </>
        )
    }
}

ReactDOM.render(
    <>
        <AccountPage />
    </>,
    document.getElementById("root"));