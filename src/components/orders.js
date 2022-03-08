import React, { Component } from 'react';
import Axios from 'axios';
import Decimalizer from '../functions/decimalizer';

class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
            orderNums: [],
            user: "",
            error: ""
        }
    }
    async componentDidMount() {
        let user = await Axios.get("/loginStatus")
        //if they are logged in, set their email equal to user to be populated in state
        if (user.data.email) {
            user = user.data.email
        }
        //if not logged in, make user empty
        else { user = "" }
        let orders = await Axios.post("/orders")
        //If the user is not logged in, orders.data will simply return false.
        if (orders.data && orders.data.length > 0) {
            let formattedOrders = []
            let orderNumbers = []
            orders.data.forEach((order, i) => {
                formattedOrders.push(order.cart)
                orderNumbers.push(order._id)
            })
            this.setState({
                orders: formattedOrders,
                user: user,
                orderNums: orderNumbers
            })
        }
        else if (orders.data.length == 0) {
            this.setState({
                error: "This account has no orders.",
                user: user
            })
        }
        else {
            this.setState({
                error: "You are not logged in."
            })
        }
    }
    ordersMap() {
        //this.state.orders = [[{}, {}, {}], [{}, {}, {}], ...]
        if (this.state.orders.length == 0) {
            return (
                <>
                    <h2>{this.state.error} Click here to see <a href="/"> current sales</a> or <a href="/login">Log in</a></h2>
                </>
            )
        }
        const itemTotal = (item) => {
            let total
            if (item.sale) {
                /*takes the relevant price value (string) and turns it into an integer, multiplies by 
                quantity, then turns back into a string in decimal format for displaying*/
                total = Decimalizer(parseInt(item.disPrice.replace(".", "")) * item.quantity)
            }
            else {
                total = Decimalizer(parseInt(item.ogPrice.replace(".", "")) * item.quantity)
            }
            return total
        }
        return (
            //mapping the array of orders, then mapping an order to iterate through the items in the order
            this.state.orders.map((order, i) => (
                <div className="single-order">
                    <h2 id="orderNum">Order #{this.state.orderNums[i]}</h2>
                    <div className="order-key">
                        <p id="key-start">Image</p>
                        <p className="key-value">Name</p>
                        <p className="key-value">Quantity</p>
                        <p className="key-value">Total</p>
                    </div>
                    {
                        order.map((item, i) => (
                            <div className="order-item">
                                <img className="order-img" src={item.picture[0]}></img>
                                <p className="order-name order-txt">{item.name}</p>
                                <p className="order-quantity order-txt">{item.quantity}</p>
                                <p className="item-total order-txt">{itemTotal(item)}</p>
                            </div>
                        ))
                    }
                </div>
            ))
        )
    }
    render() {
        return (
            <div>
                <h1 className="feat-text">Orders for: {this.state.user}</h1>
                <div id="orders-body">
                    {this.ordersMap()}
                </div>
            </div>
        )
    }
}

export default Orders