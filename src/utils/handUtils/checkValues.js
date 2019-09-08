import getMultipleOccurances from './getMultipleOccurances';
import findValueIndexInMultidimensionalArray from './findValueIndexInMultidimensionalArray';

/**
 * Get array of occurances of all cards on a table
 * @param {array} cards 
 * @returns {array} multiple occurances of cards
 */
const checkValues = (cards) => {
    let occurances = [];
    
    cards.forEach(card => {
        let val = card[0];
        if(occurances.length) {
            let index = findValueIndexInMultidimensionalArray(occurances, val, 0);
            if(index !== -1) {
                occurances[index][1] += 1;
            } else {
                occurances.push([val, 1]);
            }
        } else {
            occurances.push([val, 1]);
        }
    });

    let multiOccurances = getMultipleOccurances(occurances);

    return multiOccurances;
}

export default checkValues;