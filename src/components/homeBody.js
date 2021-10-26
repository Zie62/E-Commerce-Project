import React, { Component } from 'react';
import Axios from 'axios';

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            names: [],
            pics: [],
            ogPrices: [],
            disPrices: []
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.featLoader = this.featLoader.bind(this)
    }
    componentDidMount() {
        Axios.get("/sale-db").then((response) => {
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
    featLoader() {
        let zipper = this.state.names.map((n, i) => [n, this.state.pics[i], this.state.ogPrices[i], this.state.disPrices[i]]);
        return (
            <div>
                {zipper.map((listing, i) => (
                    <div className="feat-box col-2" key={i}>
                        <a href="#" className="feat-link">
                            <img src={listing[1]} alt="oopsies" className="feat-img" />
                            <h4 className="feat-name">{listing[0]}</h4>
                        </a>
                        <h5 className="feat-price crossed">${listing[2]}</h5>
                        <h5 className="feat-price">${listing[3]}</h5>
                    </div>
                ))}
            </div>
        )
    }
    render() {
        return (
            <div id="primary" className="container-fluid">
                <div id="mainBody" className="row">
                    <div id="featured" className="col-10">
                        <h1 id="intro">Featured Deals</h1>
                        <div className="col-10 feat-package">
                            {this.featLoader()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Body;