const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const cron = require('node-cron')
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const sessionStorage = require('connect-mongodb-session')(session);
require('dotenv').config();

const port = process.env.PORT || 5000;
const uri = process.env.URI;
const TIMEOUT = 10000

//connects backend to the MongoDB atlas database via mongoose.
const connector = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

//session storage for user sessions with config, expires value is math for 4 hours
const sessions = new sessionStorage({
    uri: uri,
    collection: 'userSessions',
    expires: 1000 * 60 * 60 * 4,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
});

//error handler for session storage
sessions.on('error', (error) => {
    console.log(error)
});

const Schema = mongoose.Schema;
//schemas for item listings
const listingSchema = new Schema({
    picture: { type: Array, required: true },
    name: { type: String, required: true },
    ogPrice: { type: String, required: true },
    disPrice: { type: String, required: true },
    sale: { type: Boolean, required: false },
    description: { type: String, required: false },
})
const Listing = mongoose.model("Listing", listingSchema)
//schema for users for when emails and password hashes are being sent in.
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    cartId: { type: String, required: false },
    sessionId: { type: String, required: false }
})
const User = mongoose.model("Users", userSchema)
//schema for instanced carts, capped at 5000 carts for now
const cartSchema = new Schema({
    uid: { type: String, required: true },
    cart: { type: Array, required: false },
    timestamp: { type: Date, required: true },
    account: { type: String, required: false },
}, { capped: { max: 5000, autoIndexId: true } })
const Cart = mongoose.model("Carts", cartSchema)
//schema for ordered carts / "order history" for users.
const ordersSchema = new Schema({
    account: { type: String, required: true },
    cart: { type: Array, required: true },
    timestamp: { type: Date, required: true },
})
const Order = mongoose.model("Orders", ordersSchema)
/*this checks if the next day has passed and updates the sales 
property of random listings if it has. I decided to do this to create an artificial 
"specials" page that would change on a timer to give an illusion of daily sales.*/
const timeCheck = async () => {
    try {
        //takes all listings off sale
        await Listing.updateMany({}, { $set: { sale: false } }, { new: true })
        //supplies an array of the listings to be referenced at the end
        let listings = await Listing.find({})
        //this serves as storage for the items to be put on sale 
        let saleArray = []
        //for loop to generate 6 unique values to represent the items being put on sale
        for (let i = 0; i < 6; i) {
            //generates random values, pushes if it is unique, otherwise loops again
            let selector = ~~(Math.random() * listings.length);
            if (saleArray.includes(selector)) { }
            else {
                saleArray.push(selector)
                i++
            };
        }
        //updates each new item which is on sale
        for (let i = 0; i < saleArray.length; i++) {
            await Listing.findOneAndUpdate({ _id: listings[saleArray[i]]._id }, { sale: true }, { new: true })
        }
    }
    catch (error) {
        console.log(error)
    }
};
//this schedules the timeCheck / sale updating function once a day at midnight
cron.schedule('0 0 0 * * *', () => {
    timeCheck();
})
//returns a listing based on the provided id value.
const listingByID = async (id, res) => {
    try {
        let results = await Listing.find({ _id: id })
        if (results.length < 1) {
            res.status(500).send();
        }
        res.json(results)
    }
    catch (error) {
        console.log(error)
        res.status(500).send();
    }
}
//this commented out function was used to create and save new store listings
// const createAndSaveListing = (pictures, listname, oriPrice, discPrice) => {
//     /*because this is taken from a text input box on a html form, this must be split
//     into an array to be properly saved to the database.
//     This is not currently used as i dont have a way to gate it to admin accounts,
//     but i will in the future.*/
//     let picArray = pictures.split(",")
//     var newListing = new Listing({ picture: picArray, name: listname, ogPrice: oriPrice, disPrice: discPrice })
//     newListing.save(function (err, data) {
//         if (err) return console.error(err);
//     });
// };
//Gives all item listings, async to prevent repeated requests to database
const giveAllListings = async (res) => {
    try {
        let results = await Listing.find({})
        if (results.length < 5) {
            res.status(500).send();
        }
        else {
            //responds with results to frontend if relevant, otherwise returns the values.
            if(res){
            res.json(results)
            }
            else{
            return results
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send();
        return
    }
};
//gives all item listings that are on sale
const giveSaleListings = async (res) => {
    try {
        let results = await Listing.find({ sale: true })
        //returns an error if the listings are not found properly.
        if (results.length < 5) {
            res.status(500).send()
        }
        else {
            res.json(results)
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send()
    }
};
/*checks if the user has a cart based on a post request with cookies and 
passes down the rest of the post information.*/
const checkForCart = async (session, update) => {
    try {
        //checks if the user has a cart
        let data = await Cart.find({ uid: session })
        //If they dont have a cart, create a new cart for them
        if (data[0] === undefined) { return await createNewCart(session, update) }
        /*if they do have a cart, and there is an update to be made (rather than simply 
        checking for the cart), add the update to cart*/
        if (update.id) { return await addToCart(session, update) }
    }
    catch (error) {
        console.log(error)
        return false
    }
};
/*creates a new cart if the session cookie does not match an existing user. this allows
for a cart to consistently be brought through a browsing experience on a given browser
in a given session.*/
const createNewCart = async (uid, poster, email) => {
    try {
        let newCart
        /*checks if this new cart is being made with an email (aka if it is from an 
            account logging in), or if it is a guest cart being created */
        if (email) {
            newCart = new Cart({ uid: uid, cart: [], timestamp: Date.now(), account: email })
        }
        else {
            newCart = new Cart({ uid: uid, cart: [], timestamp: Date.now() })
        }
        //saves the new cart to the database
        await newCart.save(function (err, data) {
            if (err) return console.error(err)
            //if there is an item to be added to the cart after saving the new cart, it is added here.
            if (poster['id']) { addToCart(uid, poster) }
        })
        return true
    }
    catch (error) {
        console.log(error)
        return false
    }
};
/*This function adds an item to a users cart, checking for a handful of potential 
data states within the cart to make sure duplicate items cannot be added. This
function is only called after either creating a new guest cart (which is done
    on first item add) or after checking if a cart exists within CheckForCart()*/
const addToCart = async (uid, poster) => {
    /*this prevents someone with cookies disabled from adding items to a cart
    with a currently undefined / null uid. These occur when a cart is linked to
    a user account, but that account has logged out.*/
    if (!uid) { return "Cookies disabled" }
    let cart
    //finds the cart in database with the relevant session id
    try {
        cart = await Cart.find({ uid: uid })
    }
    catch (error) {
        console.log(error)
        return false
    }
    //if the query does not return any objects, return void
    if (!cart[0]) {
        return false
    }
    //this is where the actual array of items is in the cart
    cart = cart[0].cart
    let itemid = poster.id
    let updateObj = [itemid, poster.quantity]
    //checks if the cart exist, but is empty. if so, pushes new item to cart and updates
    if (!cart[0]) {
        cart.push(updateObj)
        try {
            await Cart.findOneAndUpdate({ uid: uid }, { $set: { cart: cart } }, { new: true })
            return true
        }
        catch (error) {
            console.log(error)
            return false
        }
    }
    else {
        //checks if each item previously in the cart has the ID of the new item being added
        for (let i = 0; i < cart.length; i++) {
            //updates the existing item if it does
            if (cart[i].includes(itemid)) {
                cart[i] = updateObj
                //sends cart update to database and returns void
                try {
                    await Cart.updateOne({ uid: uid }, { $set: { cart: cart } }, { new: true })
                    return true
                }
                catch (error) {
                    console.log(error)
                    return false
                }
            }
        }
        //if the item does not exist already within the cart, push to end and update
        cart.push(updateObj)
        try {
            await Cart.updateOne({ uid: uid }, { $set: { cart: cart } }, { new: true })
            return true
        }
        catch (error) {
            console.log(error)
            return false
        }
    }
}
//gets a users cart based on their Session ID cookie (abbreviated as "uid" or user ID)
const getTheirCart = async (uid, res) => {
    //makes sure the user has a sessionID cookie to prevent access to carts with "null" cookies
    if (uid) {
        try {
            res.json(await Cart.find({ uid: uid }))
        }
        catch (error) {
            console.log(error)
        }
    }
}
const deleteFromCart = (data, uid) => {
    let cart = data.cart
    console.log(cart)
    /*slimCart is the stripped down cart stored in the database, only containing
    the ID of an item and the quantity of that item. The display information is populated
    on the frontend before being shown on UI.*/
    let slimCart = []
    for (i = 0; i < cart.length; i++) {
        slimCart[i] = [cart[i]._id, cart[i].quantity]
    }
    //for loop populates slimCart[0] with null when cart is empty, this clears that out.
    if (slimCart[0] === undefined || slimCart[0][0] === undefined) {
        slimCart = []
    }
    //Data doesnt need to be awaited on, so is called synchronously with a callback for errors.
    Cart.findOneAndUpdate({ uid: uid }, { $set: { cart: slimCart } }, { new: true },
        (err) => {
            if (err) return console.error(err);
            return ("item deleted")
        }
    )
}
const createUserAccount = async (body, res) => {
    //makes email lowercase to prevent duplicate accounts from slightly different upper/lowercase distribution
    let email = (body.email).toLowerCase();
    /*this tests to make sure the email in the body fulfils the email formating requirements.
    This is also validated on the frontend, but a user could post to this API using
    Postman or a similar dev utility to circumvent that.*/
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRegex.test(email)) {
        return false
    }
    //checks if account already exists
    let account = await User.findOne({ email: email })
    if (account) {
        console.log("existing")
        /*if the account exists, returns false so it is known a new account was not created.
        This displays an error on the frontend.*/
        return false
    }
    //email format is validated on frontend using a regex
    try {
        //creates a salt and subsequent hash value for the password to be stored more securely
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(body.pass, salt)
        await User.create({ email: email, password: hashed, salt: salt })
        return true
    }
    catch (error) {
        console.log(error)
        res.status(500).send()
        return false
    }

}
const loginUserAccount = async (body, sessionid, res) => {
    let email = await body.email.toLowerCase();
    let account = await User.findOne({ email: email })
    //gonna make sure this gets implemented into the UI in the future, but not today
    if (!account) { return false }
    try {
        //compares submitted password to accounts password (hashed and salted)
        const hashed = await bcrypt.hash(body.pass, account.salt)
        if (hashed === account.password) {
            /*this checks for existing accounts logged in with a given users session ID. 
            If it exists, removes the session ID from that users account to prevent multiple logins
            with one session ID. */
            let existingLogin = await User.findOne({ sessionId: sessionid })
            if (existingLogin) {
                await User.findOneAndUpdate({ sessionId: sessionid }, { $set: { sessionId: null } }, { new: true })
            }
            //logs user into new account for this session
            await User.findOneAndUpdate({ email: email }, { $set: { sessionId: sessionid } }, { new: true })
            //Checks for existing cart linked to the account and links it to users session
            try {
                accountCartCheck(email, sessionid, res)
                await Cart.findOneAndUpdate({ account: email }, { $set: { uid: sessionid } }, { new: true })
                /*currently this wont do anything as I havent made the mechanism for linking a cart to
                an account when its made, but will be useful later. */
            }
            catch (error) {
                console.log(error)
            }
            return true
        }
        else {
            return false
        }
    }
    catch {
        return false
    }
}
//checks for existing account cart
const accountCartCheck = async (email, sessionid, res) => {
    try {
        //looks for a potential, existing cart linked to their account
        let potentialCart = await Cart.findOne({ account: email })
        if (!potentialCart) {
            /*if there is no linked cart, link their current session ID cart (guest cart)
             to their account*/
            let currentCart = await Cart.findOne({ uid: sessionid })
            if (!currentCart) {
                //this creates an empty cart to assign to the account
                /*id: undefined makes it so the function knows there 
                is no item to add to the cart after creating it*/
                await createNewCart(sessionid, { id: undefined }, email)
            }
            //if the cart does exist already, add the accounts email to it
            else {
                await Cart.findOneAndUpdate({ uid: sessionid }, { $set: { account: email } }, { new: true })
            }
        }
        else {
            /*if there exists a cart for their account, remove thier sessionId from their guest cart,
            this prevents multiple carts with shared sessionId which could screw up checkout process*/
            await Cart.findOneAndUpdate({ uid: sessionid }, { $set: { uid: undefined } }, { new: true })
            //if there exists a cart for their account, add their current session id to it
            await Cart.findOneAndUpdate({ account: email }, { $set: { uid: sessionid } }, { new: true })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send()
    }
    return
}
/*checks for login based on the users session id, then returns email or false so the login
bar can display the account that is logged in.*/
const checkLogin = async (session, res) => {
    /*makes sure session is not null to prevent being logged into an account that
    has its session assigned to "null"*/
    if (session) {
        try {
            let account = await User.findOne({ sessionId: session })

            if (account) {
                res.json({ email: account.email })
                return
            }
            else {
                /*if the account does not exist, it returns false as that is the value i use on
                front end to express not being logged into an account*/
                res.json({ email: false })
                return
            }
        }
        catch (error) {
            console.log(error)
            return
        }
    }
}
const logOut = async (session, email, res) => {
    try {
        /*removes the current session from the users account, effectively logging them
         out */
        await User.findOneAndUpdate({ sessionId: session }, { $set: { sessionId: null } }, { new: true })
        /*removes the sessionId from the cart, meaning logging out detatches your account's 
        cart from your current browsing session.*/
        await Cart.findOneAndUpdate({ account: email }, { $set: { uid: null } }, { new: true })
    }
    catch (error) {
        res.status(500).send();
    }
    return
}
//"checks out" a users cart, which can then be viewed on the account page's "Orders" section.
const checkOut = async (session) => {
    //finds the relevant user
    try {
        let user = await User.findOne({ sessionId: session })
        if (!user) {
            //if the person checking out is a guest, simply empties their cart.
            //might integrate an email confirmation system to make this meaningful
            await Cart.findOneAndUpdate({ uid: session }, { $set: { cart: [] } }, { new: true })
            return true
        }
        //retrieves relevant cart, populates the order, then saves the order
        let cart = await Cart.findOne({ account: user.email, uid: session })
        //cart.cart = [[], [], []]
        let populated = await populateOrder(cart.cart)
        console.log(populated[0])
        let order = new Order({ cart: populated, account: user.email, timestamp: Date.now() })
        await order.save()
        //clears the cart as it has been "Checked out"
        await Cart.findOneAndUpdate({ account: user.email, uid: session }, { $set: { cart: [] } }, { new: true })
        return true
    }
    catch (error) {
        console.log(error)
        return false
    }
}
const getOrders = async (session) =>{
    try{
        //finds if the person accessing the page is logged in, if not returns false.
        let user = await User.findOne({sessionId: session})
        if (!user){
            return false
        }
        //this will return all orders associated with the users email
        let orders = await Order.find({account: user.email})
        return orders
    }
    catch (error){
        console.log(error)
        return false
    }
}
const populateOrder = async(cart) =>{
    //listings = [{}, {}, {}, ...]
    let listings = await giveAllListings();
    //cart = [[id, quantity], [0, 1], []]
    let completedCart = []
    cart.forEach((item) =>{
        for(let i=0; i<listings.length; i++){
            if (item[0] == listings[i]._id){
                //populates the listing object with the quantity from the cart item
                //._doc is where the targeted data is stored, listings[i] contains lots of metadata as well.
                let popListing = {quantity: item[1], ...listings[i]._doc}
                completedCart.push(popListing)
            }
        }
    })
    //completedCart = [{}, {}, {}, ...]
    return completedCart
}

const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
/*this middleware function sets the response headers for cache control, so when a user
presses back on a webpage it does not load a potentially stale state (and therefore a
stale cart). This allows for ComponentWill/DidMount functions to execute*/
app.use((req, res, next) => {
    res.set('Cache-control', `no-store`);
    next();
});
//trusting proxy for secure cookies
app.set('trust proxy', 1)
//session middleware for creating and processing session cookies (using uuid:v4)
app.use(session({
    genid: (req) => { return uuid() },
    name: "usesh",
    secret: process.env.SECRET,
    cookie: {
        //12 hours in miliseconds, easier to understand than a raw number
        maxAge: 1000 * 60 * 60 * 12,
        secure: true
    },
    store: sessions,
    resave: true,
    saveUninitialized: true
}))

//base URL which is a page featuring the items currently on sale.
app.get("/", (req, res) => {
    /*This is called windex.html because index.html in your static file path 
    causes default base URL behavior with express.static, which disallows custom definition*/
    res.sendFile(path.join(__dirname, 'build', 'windex.html'))
});
//rest API for giving all Listings in JSON format.
app.get("/full-db", async (req, res) => {
    await giveAllListings(res)
});
//webview which contains a page which displays all the listings in the database
app.get("/products-page", async (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'products.html'))
});
//these methods are commented out as they are not currently being used
//post for creating new listings utilizing form input
/*app.post('/database-upload', (req, res) => {
    let data = req.body
    createAndSaveListing(data.picture, data.listname, data.oriPrice, data.discPrice)
    res.json("Successfully Posted!")
});*/
//serves a basic input form that post to the above route, creating a new listing
/*app.get("/dont-go-here-nothing-here", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dbentry.html'))
});*/
/*this get is used by the /item page where axios fetches the listings information
by its database ObjectID, which is always used in any redirect to the /item page below. */
app.get("/listing", async (req, res) => {
    await listingByID(req.query.id, res)
});
//single listing, fetched from the above API using the ID in the redirect query.
app.get("/item", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'singleListing.html'))
});
//returns all sale listings using a function defined earlier in the document
app.get("/sale-db", (req, res) => {
    giveSaleListings(res)
});
//updates the cart to contain a new item / updated quantity of an item
app.post("/cart-add-now", async (req, res) => {
    let update = req.body
    let status = await checkForCart(req.cookies.usesh, update)
    console.log(status)
    //status returns boolean value of true (meaning successful) or false.
    if (status) {
        res.json({ status: true })
    }
    else {
        res.json({ status: false })
    }
});
//deletes an item from the cart and handles making the cart truly empty if relevant.
app.post("/cart-delete-now", (req, res) => {
    let data = req.body
    deleteFromCart(data, req.cookies.usesh)
    res.json({ status: "Cart Item Deleted" })
})
//api call for getting a users cart from the database
app.get("/this-user-cart", async (req, res) => {
    await getTheirCart(req.cookies.usesh, res)
});
//serves the cart page 
app.get("/cart", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'cartPage.html'))
});
//serves login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'login.html'))
})
//takes in login form parameters for verification and redirects to homepage
app.post("/login", async (req, res) => {
    // body = {email: "", pass: ""}
    // session cookie = req.cookies.usersession
    console.log(req.cookies.usesh)
    let loginAttempt = await loginUserAccount(req.body, req.cookies.usesh, res)
    res.json({ status: loginAttempt })
})
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'register.html'))
})
app.post("/register", async (req, res) => {
    // body = {email: "", pass: "", submit: "submit"}
    let response = await createUserAccount(req.body, res)
    res.json({ status: response })
})
app.get("/loginStatus", async (req, res) => {
    await checkLogin(req.cookies.usesh, res)
})
app.post("/logout", async (req, res) => {
    await logOut(req.cookies.usesh, req.body.email, res)
    /*this only serves to prevent timeouts on calling this api; there is nothing 
    of meaning to respond with*/
    res.status(200).send()
})
app.post("/checkout", (req, res) => {
    let status = checkOut(req.cookies.usesh)
    //returns true if the cart has been "checked out" or false if there was an error
    res.json({ status: status })
})
//these frontend files dont exist yet (in a built state), that is tomorrows work.
// app.get("/account", (req, res) =>{
//     res.sendFile(__dirname, 'build', 'account.html')
// })
app.post("/orders", async (req, res) => {
    /*If you take your cookie from browser and use POstman or a similar utility you can see your stored orders.
    In the near future this will serve a frontend file to populate an account page.*/
    let orders = await getOrders(req.cookies.usesh)
    //returns a json object which contains the orders associated with the account they are logged in to.
    res.json(orders)
})
app.listen(port)
