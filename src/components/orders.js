import React, { Component } from 'react';
import Axios from 'axios';

class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
    }
    async componentDidMount() {
        let orders = await Axios.post("/orders")
        console.log(orders)
        //If the user is not logged in, orders.data will simply return false.
        if (orders.data) {}
        else{
            //"you are not logged in, log in to see orders or continue as guest" <- "log in" and "continue as guest" will be hyperlinked
        }
    }
}

export default Orders