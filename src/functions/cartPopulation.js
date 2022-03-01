import Axios from 'axios';
/*this function is used in multiple components, so I  created it as a standalone function
to prevent code repeating itsself.*/
const populateCart = async () => {
    let listings = [];
    //this retrieves the full database of listings so the cart can be populated.
    //it is only stored with 2 values in DB, item _id and quantity.
    let fulldb
    try {
        fulldb = await Axios.get("/full-db")
    }
    catch {
        return [['There was an error loading your cart']]
    }
    for (let i = 0; i < fulldb.data.length; i++) {
        let listing = fulldb.data[i]
        let localListing = []
        //this order is arbitrary, but maintained throughout the app.
        //in the future i would not do this, but instead use the objects in an array to get mapped.
        localListing.push(listing.name, listing.picture, listing.ogPrice,
            listing.disPrice, listing._id.toString(), undefined, listing.sale)
        listings.push(localListing)
    }
    let newCart = []
    let listing = []
    //api which returns a users cart based on the session ID.
    let userCart
    try{
        userCart = await Axios.get('/this-user-cart')
    }
    catch{
        return [['There was an error loading your cart']]
    }
    if (userCart['data'].length == 0) {
        return [['There is nothing in your cart. If this is wrong, please refresh after the page has finished loading.']]
    }
    let retrievedCart = userCart['data'][0]['cart'] || ""
    if (retrievedCart.length == 0) {
        newCart = [['There is nothing in your cart. If this is wrong, please refresh after the page has finished loading.']]
    }
    //i is the index of the item in user cart from DB, j is index of all listings
    for (let i = 0; i < retrievedCart.length; i++) {
        for (let j = 0; j < listings.length; j++) {
            /*i want to cross reference each user cart item ID with each listing to 
            find the one with the relevant information*/
            if (retrievedCart[i][0] == listings[j][4]) {
                //this populates the listing to be pushed to the local cart.
                listing = listings[j]
                /*fills the index 5 with the quantity of the item. this is the index
                all of my code expects it at but i had to add sales to the listings
                arrays so i couldnt just push.*/
                listing[5] = (retrievedCart[i][1])
                newCart.push(listing)
            }
            else { }
        }
    }
    return newCart
}

export default populateCart;