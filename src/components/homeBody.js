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
    render() {
        return (
            <div id="primary" className="container-fluid">
                <div id="mainBody" className="row">
                    <div id="featured" className="col-10">
                        <h1 id="intro">Featured Deals</h1>
                        <div className="col-10 feat-package">
                            <section className="feat-box col-2">
                                <a href="#" className="feat-link">
                                    <img src={this.state.pics[0]} alt="oopsies" className="feat-img" />
                                    <h4 className="feat-name">{this.state.names[0]}</h4>
                                </a>
                                <h5 className="feat-price crossed">${this.state.ogPrices[0]}</h5>
                                <h5 className="feat-price">${this.state.disPrices[0]}</h5>
                            </section>
                            <section className="feat-box col-2">
                                <a href="#" className="feat-link">
                                    <img src={this.state.pics[1]} alt="oopsies" className="feat-img" />
                                    <h4 className="feat-name">{this.state.names[1]}</h4>
                                </a>
                                <h5 className="feat-price crossed">${this.state.ogPrices[1]}</h5>
                                <h5 className="feat-price">${this.state.disPrices[1]}</h5>
                            </section>
                            <section className="feat-box col-2">
                                <a href="#" className="feat-link">
                                    <img src={this.state.pics[2]} alt="oopsies" className="feat-img" />
                                    <h4 className="feat-name">{this.state.names[2]}</h4>
                                </a>
                                <h5 className="feat-price crossed">${this.state.ogPrices[2]}</h5>
                                <h5 className="feat-price">${this.state.disPrices[2]}</h5>
                            </section>
                            <section className="feat-box col-2">
                                <a href="#" className="feat-link">
                                    <img src={this.state.pics[3]} alt="oopsies" className="feat-img" />
                                    <h4 className="feat-name">{this.state.names[3]}</h4>
                                </a>
                                <h5 className="feat-price crossed">${this.state.ogPrices[3]}</h5>
                                <h5 className="feat-price">${this.state.disPrices[3]}</h5>
                            </section>
                            <section className="feat-box col-2">
                                <a href="#" className="feat-link">
                                    <img src={this.state.pics[4]} alt="oopsies" className="feat-img" />
                                    <h4 className="feat-name">{this.state.names[4]}</h4>
                                </a>
                                <h5 className="feat-price crossed">${this.state.ogPrices[4]}</h5>
                                <h5 className="feat-price">${this.state.disPrices[4]}</h5>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Body;