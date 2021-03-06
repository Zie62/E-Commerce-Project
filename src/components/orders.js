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
        this.orderTotals = this.orderTotals.bind(this)
        this.ordersMap = this.ordersMap.bind(this)
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
                orderNumbers.push({ id: order._id, date: order.timestamp })
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
    orderTotals(i) {
        let order = this.state.orders[i]
        //order = [item{sale, ogPrice, disPrice}, item{}, item{}]
        let orderTotal = 0
        let items = 0
        /*Iterates through the orders array and adds the total price of each item in 
        the order's cart as well as adds the number of an item ordered. Total price
        is calculated as integers, then turned into decimal format for display.*/
        order.forEach(item => {
            //if the item was on sale, calculate using the discounted price for that item.
            if (item.sale){
                orderTotal+=(parseInt(item.disPrice.replace(".", "")) * item.quantity)
            }
            else{
                orderTotal+=(parseInt(item.ogPrice.replace(".", "")) * item.quantity)
            }
            items+=item.quantity
        })
        return (
            <div className='order-totals'>
                {/*These divs space the items and total price within a grid to save on CSS */}
                <div></div>
                <div></div>
                <p>Items: {items}</p>
                <p>Total: ${Decimalizer(orderTotal)}</p>
            </div>
        )
    }
    ordersMap() {
        //this.state.orders = [[item{}, {}, {}], [{}, {}, {}], ...]
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
        console.log(this.state.orders[0])
        return (
            //mapping the array of orders, then mapping an order to iterate through the items in the order
            this.state.orders.map((order, i) => (
                <div className="single-order">
                    <div className="order-info">
                        <h2 className="order-num">Order #{this.state.orderNums[i].id}</h2>
                        <h3 className="order-date">{(this.state.orderNums[i].date).substring(0, 10)}</h3>
                    </div>
                    {/* <div className="order-key">
                        <p className="key-value">Image</p>
                        <p className="key-value">Name</p>
                        <p className="key-value">Quantity</p>
                        <p className="key-value">Total</p>
                    </div> */}
                    {
                        order.map((item) => (
                            <div className="order-item">
                                <img className="order-img" src={item.picture[0]}></img>
                                <p className="order-name order-txt">{item.name}</p>
                                <p className="order-quantity order-txt">Quantity: {item.quantity}</p>
                                <p className="item-total order-txt">${itemTotal(item)}</p>
                            </div>
                        ))
                    }
                    {this.orderTotals(i)}
                </div>
            ))
        )
    }
    render() {
        return (
            <div>
                <h1 className="orders-feat-text">Orders for: {this.state.user}</h1>
                <div id="orders-body">
                    {this.ordersMap()}
                </div>
            </div>
        )
    }
}

export default Orders