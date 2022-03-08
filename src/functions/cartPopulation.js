import Axios from 'axios';
/*this function is used in multiple components, so I  created it as a standalone function
to prevent code repeating itsself.*/
const populateCart = async () => {
    //api which returns a users cart based on the session ID.
    let userCart
    try {
        userCart = await Axios.get('/this-user-cart')
    }
    catch {
        return [{ name: "There was an error loading your cart" }]
    }
    //if their cart does not exist, returns a message saying it is empty.
    /*this prevents retrievedCart definition from crashing page due to
    userCart.data[0] not existing*/
    if (userCart.data.length == 0) {
        return [{ name: 'There is nothing in your cart. If this is incorrect, do you have cookies enabled?' }]
    }
    //retrievedCart = [[id, quantity], [], [], ...]
    let retrievedCart = userCart.data[0].cart

    //if their cart exists but is empty, returns a message saying that.
    if (retrievedCart.length < 1) {
        return [{ name: 'There is nothing in your cart. If this is wrong, please refresh after the page has finished loading.' }]
    }
    //retrieves all items from the database to be referenced against the id's of items in the users cart
    let listings = await Axios.get("/full-db");
    // .data is the object adress of the listings from the API.
    listings = listings.data
    //listings.data = [{}, {}, {}, ...]
    //i is the index of the item in user cart from DB, j is index of all listings
    let newCart = []
    for (let i = 0; i < retrievedCart.length; i++) {
        for (let j = 0; j < listings.length; j++) {
            /*i want to cross reference each user cart item ID with each listing to 
            find the one with the relevant information*/
            if (retrievedCart[i][0] == listings[j]._id.toString()) {
                //this populates the listing with the quantity in a users cart.
                listings[j].quantity = retrievedCart[i][1]
                //this then pushes that listing into the users cart.
                newCart.push(listings[j])
            }
            //if the ID's do not match up, simply allow the loop to continue
        }
    }
    return newCart
}

export default populateCart;