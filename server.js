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
            console.log("timeChange function")
            let daysPast = Math.floor(timeDiff / dayLength)
            Timestamp.findOneAndUpdate({timestamp: oldTime}, {$set: {timestamp: oldTime+(dayLength*daysPast)}},{new: true},
                function(err, doc){
                    if (err) return console.error(err);
                    console.log(doc)
                })
            Listing.find({}, function(err,listdata){
                console.log("find}{")
                if (err) return console.error(err);
                Listing.updateMany({}, {sale: false})
                console.log("many updated")
                let numArray = []
                let saleArray = []
                for (let i=0; i<listdata.length; i++){
                    numArray.push(i)
                }
                for (let i=0; i<= 4; i){
                    let selector = ~~(Math.random() * numArray.length);
                    if (saleArray.includes(selector)){
                        i--
                    }
                    else{
                    saleArray.push(selector)
                    i++};
                }
                console.log("home stretch")
                let uniqueSales = [...new Set(saleArray)];
                for (let i=0; i<uniqueSales.length; i++){
                    Listing.findOneAndUpdate({_id: listdata[uniqueSales[i]]._id},
                    {sale: true}, {new: true},
                    (err) =>{
                        if (err) return console.error(err);
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
const giveSaleListings = (res) =>{
    Listing.find({sale: true}, function(err, data){
        if (err) return console.error(err);
        res.json(data)
})}
const app = express();

app.use(express.urlencoded({extended:"false"}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));


app.get("/full-db", (req, res) =>{
    giveAllListings(res)
});
app.get(("/"), (req, res) =>{
    timeCheck()
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
app.get("/products-page", (req, res) => {
    timeCheck()
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
    timeCheck()
    res.sendFile(path.join(__dirname, 'build', 'singleListing.html'))
});
app.get("/timestamp-tool", (req, res) =>{
    timeCheck()
    res.json("time was checked")
});
app.get("/sale-db", (req, res) =>{
    giveSaleListings(res)
});
app.listen(port)