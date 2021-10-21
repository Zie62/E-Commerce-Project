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
        this.imgMap = this.imgMap.bind(this)
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
    imgMap() {
        //zipper turns the state into an array of arrays where each one represents
        //a listing to be displayed on the webpage. 
        let zipper = this.state.names.map((n, i) => [n, this.state.pics[i], this.state.ogPrices[i], this.state.disPrices[i]]);
        return (
            <div>
                {zipper.map((pic, i) => (
                    <div className="feat-box col-2" key={i}>
                        <a href="#" className="feat-link">
                            <img src={pic[1]} alt="oopsies" className="feat-img" />
                            <h4 className="feat-name">{pic[0]}</h4>
                        </a>
                        <h5 className="feat-price">${pic[2]}</h5>
                    </div>
                ))}
            </div>
        )
    }
    render() {
        return (
            <div id="primary" className="container-fluid">
                <div id="stockBody" className="row">
                    <div id="stock" className="col-10">
                        {this.imgMap()}
                    </div>
                </div>
            </div>
        )
    }
}
export default FullList;