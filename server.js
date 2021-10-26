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
    disPrice: {type: String, required: true},
    sale: {type: Boolean, required: false}
})
const Listing = mongoose.model("Listing", listingSchema)

const saleTime = new Schema({
    timestamp: {type: Number, required: true}
})
const Timestamp = mongoose.model("Timestamp", saleTime)
const timeCheck = () =>{
    console.log("Timecheck has commensed")
    let curTime = Date.now()
    Timestamp.find({}, function(err, timedata){
        if (err) return console.error(err);
        //This calculates time since last sale randomization
        let oldTime = timedata[0].timestamp
        let timeDiff = curTime - oldTime;
        //this number represents milliseconds in a day
        let dayLength = 86400000;
        if (timeDiff >= dayLength){
            console.log("in here")
            Timestamp.findOneAndUpdate({timestamp: oldTime}, {$set: {timestamp: oldTime+dayLength}},{new: true},
                function(err, doc){
                    if (err) return console.error(err);
                    console.log(doc)
                })
            Listing.find({}, function(err,listdata){
                if (err) return console.error(err);
                console.log("In here too")
                let numArray = []
                let saleArray = []
                for (let i=0; i<listdata.length; i++){
                    numArray.push(i)
                }
                for (let i=0; i<= 4; i++){
                    let selector = ~~(Math.random() * numArray.length);
                    saleArray.push(selector);
                }
                let uniqueSales = [...new Set(saleArray)];
                for (let i=0; i<uniqueSales.length; i++){
                    console.log(listdata[uniqueSales[i]]._id)
                    Listing.findOneAndUpdate({_id: listdata[uniqueSales[i]]._id},
                    {sale: true}, {new: true},
                    (err, doc) =>{
                        if (err) return console.error(err);
                        console.log(doc)
                    })
                }
            })
        }
        else{};
})};
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
});
app.get(("/"), (req, res) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
app.get("/products-page", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'products.html'))
});
app.post('/database-upload', (req, res)=>{
    createAndSaveListing(req.body.picture, req.body.listname, req.body.oriPrice, req.body.discPrice)
    res.json("Successfully Posted!")
});
app.get("/dont-go-here-nothing-here", (req, res) =>{
    res.sendFile(path.join(__dirname,'build','dbentry.html'))
});
app.get("/listing", (req, res) =>{
    listingByID(req.query.id, res)
});
app.get("/item", (req, res) =>{
    res.sendFile(path.join(__dirname, 'build', 'singleListing.html'))
});
app.get("/timestamp-tool", (req, res) =>{
    timeCheck()
    res.json("time was checked")
});
app.listen(port)