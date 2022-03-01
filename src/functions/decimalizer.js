const Decimalizer = (integer) => {
    let str = integer.toString();
    let formatted = str.slice(-0, -2).concat("." + str[str.length-2] + str[str.length-1])
    return formatted
}

export default Decimalizer