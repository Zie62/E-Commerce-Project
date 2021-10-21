import "./app.css";
import "./bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/navBar';

class Testing extends React.Component {
    render() {
        return (
            <div>
                <h1> extra little line for fuck sake</h1>
            </div>
        )
    }
}

ReactDOM.render(
    <div><NavBar /><Testing /></div>, document.getElementById("root"));