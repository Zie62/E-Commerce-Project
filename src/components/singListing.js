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
    }
    componentDidMount(){
        let queryId = "/listing?id=".concat(queryParams.id)
        console.log(queryId)
        Axios.get(queryId).then((response) =>{
            console.log(response.data)
            this.setState({
                name: response.data[0].name,
                pic: response.data[0].picture,
                ogPrice: response.data[0].ogPrice,
                disPrice: response.data[0].disPrice
            })
        })
    }
    render(){
        console.log(this.state)
        let listing = [this.state.name, this.state.pic, this.state.ogPrice, this.state.disPrice]
        console.log(listing)
        return(
            <div className="feat-box col-2">
                <a href="#" className="feat-link">
                    <img src={listing[1]} alt="oopsies" className="feat-img" />
                    <h4 className="feat-name">{listing[0]}</h4>
                </a>
                <h5 className="feat-price">${listing[2]}</h5>
            </div>
        )
    }
}

export default ListBody;