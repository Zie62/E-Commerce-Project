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
    saleCheck(){
        console.log(this.state.sale)
        if (this.state.sale){
            return(
                <div>
                    <h5 className="feat-price crossed">${listing[2]}</h5>
                    <h5 className="feat-price">${listing[3]}</h5>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h5 className="feat-price">${listing[2]}</h5>
                </div>
            )
        }
    }
    render(){
        let listing = [this.state.name, this.state.pic, this.state.ogPrice, this.state.disPrice]
        return(
            <div className="feat-box col-2">
                <img src={listing[1]} alt="oopsies" className="feat-img" />
                <h4 className="feat-name">{listing[0]}</h4>
                {this.saleCheck()}
            </div>
        )
    }
}

export default ListBody;