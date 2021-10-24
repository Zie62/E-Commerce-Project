const express = require("express");
const mongoose = require("mongoose")
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 5000;
const uri = process.env.URI;
const TIMEOUT = 10000
const connector = mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    picture: {type: String, required: true},
    name: {type: String, required: true},
    ogPrice: {type: String, required: true},
    disPrice: {type: String, required: true}
})
const Listing = mongoose.model("Listing", listingSchema)

const webviewSchema = new Schema({
    page: {type: String, required: true},
    Ip: {type: String, required:true}
});
const Webview = mongoose.model("Webview", webviewSchema);

const listingByID = (id, res) =>{
    Listing.find({_id: id}, function(err,data){
        if (err) return console.error(err);
        res.json(data)
    })
}
const createAndSaveListing = (picture, listname, oriPrice, discPrice) => {
    var newListing = new Listing({picture: picture, name:listname, ogPrice: oriPrice, disPrice:discPrice})
    newListing.save(function(err,data){
        if (err) return console.error(err);
        done(null,data)
    });
};
const findListingByName = (listName, res) => {
    Listing.find({name: listName}, function(err, data){
        if (err) return console.error(err);
        res.json(data)
    });
};
const findList = (listName, res) =>{
    findListingByName(listName, res)
};
const giveAllListings = (res) =>{
    Listing.find({}, function(err, data){
        if (err) return console.error(err);
        res.json(data)
    })
};
const app = express();

app.use(express.urlencoded({extended:"false"}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get("/full-db", (req, res) =>{
    giveAllListings(res)
})
app.get("/"), (req, res) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
}
app.get("/products-page", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'products.html'))
})
app.post('/database-upload', (req, res)=>{
    createAndSaveListing(req.body.picture, req.body.listname, req.body.oriPrice, req.body.discPrice)
    res.json("Successfully Posted!")
})
app.get("/dont-go-here-nothing-here", (req, res) =>{
    res.sendFile(path.join(__dirname,'build','dbentry.html'))
})
app.get("/listing", (req, res) =>{
    listingByID(req.query.id, res)
})
app.listen(port)