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
            disPrices: [],
            ids:[],
            sales: []
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.listingsMap = this.listingsMap.bind(this)
    }
    componentDidMount() {
        /*this axios function calls my /full-db REST API then passes the JSON to a nameless 
        function which puts the relevant data into the state to be referenced every time the
        web page is opened*/
        Axios.get("/full-db").then((response) => {
            var nameList = []
            var picList = []
            var ogPrices = []
            var disPrices = []
            var idList = []
            var salesList =[]
            for (let i = 0; i < response.data.length; i++) {
                let listing = response.data[i]
                nameList.push(listing.name)
                picList.push(listing.picture)
                ogPrices.push(listing.ogPrice)
                disPrices.push(listing.disPrice)
                idList.push(listing._id.toString())
                salesList.push(listing.sale)
            }
            this.setState({
                names: nameList,
                pics: picList,
                ogPrices: ogPrices,
                disPrices: disPrices,
                ids: idList,
                sales: salesList
            })
        });
    }
    listingsMap() {
        /*zipper turns the state into an array of arrays where each one represents
        a listing to be displayed on the webpage. */
        let zipper = this.state.names.map((name, i) => [name, this.state.pics[i], this.state.ogPrices[i], this.state.disPrices[i], this.state.ids[i]]);
        //checks sale status of each item at index i and returns a class that either makes it display:none or show regularly
        let saleCheck = (i)=>{
            if (this.state.sales[i]){
                return "feat-price"
            }
            else{return "clear"}
        }
        return (
            //maps the zipper array into individual UI elements to be rendered. 
            <div>
                {zipper.map((listing, i) => (
                    <div className="feat-box col-2" key={i}>
                        <a href={"/item?id=".concat(listing[4])} className="feat-link">
                            <img src={listing[1]} alt="oopsies" className="feat-img" />
                            <h4 className="feat-name">{listing[0]}</h4>
                        </a>
                        <h5 className="feat-price">${listing[2]}</h5>
                        <h5 className={saleCheck(i)} >${listing[3]}</h5>
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
                        {this.listingsMap()}
                    </div>
                </div>
            </div>
        )
    }
}
export default FullList;
