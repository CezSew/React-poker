/**
 * Get only multiple occurances of cards
 * @param {array} occurances 
 * @returns {array}
 */
const getMultipleOccurances = (occurances) => {
    let result = [];
    occurances.forEach(el => {
        if(el[1] > 1) {
            result.push(el, el[1]);
        }
    }) 

    return result;
}

export default getMultipleOccurances;