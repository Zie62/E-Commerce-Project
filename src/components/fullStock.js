import React, { Component } from 'react';
import Axios from 'axios';
import { calculateObjectSize } from 'bson';

class FullList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            names: [],
            pics: [],
            ogPrices: [],
            disPrices: []
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.conTarget = this.conTarget.bind(this)
    }
    componentDidMount() {
        Axios.get("/full-db").then((response) => {
            var nameList = []
            var picList = []
            var ogPrices = []
            var disPrices = []
            for (let i = 0; i < response.data.length; i++) {
                let listing = response.data[i]
                nameList.push(listing.name)
                picList.push(listing.picture)
                ogPrices.push(listing.ogPrice)
                disPrices.push(listing.disPrice)
            }
            this.setState({
                names: nameList,
                pics: picList,
                ogPrices: ogPrices,
                disPrices: disPrices
            })
        });
    }
    conTarget() {
        <div>
            {this.state.map((state, i) => (
                <div>
                    <a href="#" className="feat-link">
                        <img src={state.pics[i]} alt="oopsies" className="feat-img" />
                        <h4 className="feat-name">{state.names[i]}</h4>
                    </a>
                    <h5 className="feat-price">${state.ogPrices[i]}</h5>
                </div>
            ))}
        </div>
    }
    render() {
        <div id="primary" className="container-fluid">
            <div id="mainBody" className="row">
                <div id="stock" className="col-10">
                    {this.conTarget()}
                </div>
            </div>
        </div>
    }
}
export default FullList;