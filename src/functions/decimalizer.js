/*this takes in an integer and turns it into a string that represents monetary value
by slicing off the last 2 values and concatenating them back on with a decimal point.
Used in the checkout page to display values as they should be while still using
integers for the actual calculations. (To prevent float rounding errors)*/
const Decimalizer = (integer) => {
    let str = integer.toString();
    let formatted = str.slice(-0, -2).concat("." + str[str.length-2] + str[str.length-1])
    return formatted
}

export default Decimalizer