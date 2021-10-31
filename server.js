const express = require("express");
const mongoose = require("mongoose")
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 5000;
const uri = process.env.URI;
const TIMEOUT = 10000
const connector = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    picture: { type: String, required: true },
    name: { type: String, required: true },
    ogPrice: { type: String, required: true },
    disPrice: { type: String, required: true },
    sale: { type: Boolean, required: false }
})
const Listing = mongoose.model("Listing", listingSchema)

const saleTime = new Schema({
    timestamp: { type: Number, required: true }
})
const Timestamp = mongoose.model("Timestamp", saleTime)
/*this checks if midnight (UNIX time) of the next day has passed and updates the specials sales if it has. 
I decided to do this to create an artificial "specials" page that would change when people open
the site, and initially i was gonna learn async/await too but i couldnt get that to work.  */
const timeCheck = () => {
    let curTime = Date.now()
    Timestamp.find({}, function (err, timedata) {
        if (err) return console.error(err);
        //This calculates time since last sale randomization
        let oldTime = timedata[0].timestamp
        let timeDiff = curTime - oldTime;
        //this number represents milliseconds in a day
        let dayLength = 86400000;
        if (timeDiff >= dayLength) {
            let daysPast = Math.floor(timeDiff / dayLength)
            Timestamp.findOneAndUpdate({ timestamp: oldTime }, { $set: { timestamp: oldTime + (dayLength * daysPast) } }, { new: true },
                function (err) {
                    if (err) return console.error(err);
                })
            Listing.find({}, function (err, listdata) {
                if (err) return console.error(err);
                let numArray = []
                let saleArray = []
                for (let i = 0; i < listdata.length; i++) {
                    numArray.push(i)
                }
                for (let i = 0; i < 5; i) {
                    let selector = ~~(Math.random() * numArray.length);
                    if (saleArray.includes(selector)) { }
                    else {
                        saleArray.push(selector)
                        i++
                    };
                }
                /*this is an async function as i wanted to avoid the 200ms timeout 
                initially but i found the relevant documentation to be confusing. 
                For now, its going to be used as a regular function.*/ 
                let saleUpdater = async function () {
                    try {
                        //makes all listing items sale porperty false
                        await Listing.updateMany({}, { sale: false }, { new: true },
                            (err) => {
                                console.log("bing")
                                if (err)
                                    return console.error(err);
                                return ("successfully updated")
                            }).catch((error) => {
                                console.error(error);
                            })
                    }
                    catch (err) {
                        console.error(err)
                    }
                }
                saleUpdater()
                let saleMaker = (lData, i) => {
                    //makes the new sales be assinged to their relevant listings
                        Listing.findOneAndUpdate({ _id: lData[saleArray[i]]._id },
                            { sale: true }, { new: true },
                            (err) => {
                                console.log("boing")
                                if (err) return console.error(err);
                            })                    
                }
                /*this function has a 200ms timeout to avoid being intercepted by a still executing 
                    saleUpdater function above, wanted to utilize async/await for it but couldnt get 
                    that to work at the time, may revisit and find resources to explain it.*/
                setTimeout(() =>{for (let i = 0; i < saleArray.length; i++) {
                    saleMaker(listdata, i)
                }}, 200)
                
            })
        }
        else { };
    })
};
const listingByID = (id, res) => {
    Listing.find({ _id: id }, function (err, data) {
        if (err) return console.error(err);
        res.json(data)
    })
}
const createAndSaveListing = (picture, listname, oriPrice, discPrice) => {
    var newListing = new Listing({ picture: picture, name: listname, ogPrice: oriPrice, disPrice: discPrice })
    newListing.save(function (err, data) {
        if (err) return console.error(err);
        done(null, data)
    });
};
const giveAllListings = (res) => {
    Listing.find({}, function (err, data) {
        if (err) return console.error(err);
        res.json(data)
    })
};
const giveSaleListings = (res) => {
    Listing.find({ sale: true }, function (err, data) {
        if (err) return console.error(err);
        res.json(data)
    })
}
const app = express();

app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get("/", (req, res) => {
    timeCheck()
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
app.get("/full-db", (req, res) => {
    giveAllListings(res)
});
app.get("/products-page", (req, res) => {
    timeCheck()
    res.sendFile(path.join(__dirname, 'build', 'products.html'))
});
app.post('/database-upload', (req, res) => {
    let data = req.body
    createAndSaveListing(data.picture, data.listname, data.oriPrice, data.discPrice)
    res.json("Successfully Posted!")
});
//serves a basic input form that post to the above method, creating a new listing
app.get("/dont-go-here-nothing-here", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'dbentry.html'))
});
app.get("/listing", (req, res) => {
    listingByID(req.query.id, res)
});
app.get("/item", (req, res) => {
    timeCheck()
    res.sendFile(path.join(__dirname, 'build', 'singleListing.html'))
});
app.get("/sale-db", (req, res) => {
    timeCheck()
    giveSaleListings(res)
});
app.listen(port)
