import React, { Component } from 'react';
import Axios from 'axios';

const queryStr = window.location.search.substr(1);
var queryParams = queryStr.split("&").reduce((current, param) =>{
    const [key, value] = param.split('=');
    current[key] = value;
    return current
}, {})
class ListBody extends Component{
    constructor(props) {
        super(props) 
        this.state = {
            name: "",
            pic: "",
            ogPrice: "",
            disPrice: "",
            sale: false
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.saleCheck = this.saleCheck.bind(this)
    }
    /*fetches the relevant API as specified in the query
    and puts its data into the state to be rendered*/
    componentDidMount(){
        let queryId = "/listing?id=".concat(queryParams.id)
        Axios.get(queryId).then((response) =>{
            this.setState({
                name: response.data[0].name,
                pic: response.data[0].picture,
                ogPrice: response.data[0].ogPrice,
                disPrice: response.data[0].disPrice,
                sale: response.data[0].sale
            })
        })
    }
    saleCheck(original, discount){
        //shows sale or original price for a listing depending on its sale status
        if (this.state.sale){
            return(
                <div>
                    <h5 className="sing-price crossed">${original}</h5>
                    <h5 className="sing-price">${discount}</h5>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h5 className="sing-price">${original}</h5>
                </div>
            )
        }
    }
    render(){
        let listing = [this.state.name, this.state.pic, this.state.ogPrice, this.state.disPrice]
        return(
            <div className="sing-listing">
                <img src={listing[1]} alt="oopsies" className="full-img" />
                <h4 className="sing-name">{listing[0]}</h4>
                {this.saleCheck(listing[2], listing[3])}
            </div>
        )
    }
}

export default ListBody;
