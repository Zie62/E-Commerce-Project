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
        return(
        <div>
            {this.state.pics.map((state, i) => (
                <div>
                    <img src={state.pics[i]} alt="oopsies" className="feat-img" />
                </div>
            ))}
        </div>
        )
    }
    render() {
        return (
            <div id="primary" className="container-fluid">
                <div id="mainBody" className="row">
                    <div id="stock" className="col-10">
                        {this.imgMap()}
                    </div>
                </div>
            </div>
        )
    }

}
export default FullList;