const getPlayerHand = (cards) => {
    let valuesAndSuits = checkValues(cards);    
    let flushCombo = getFlushCombo(cards);
    let combos = getValueCombos(valuesAndSuits, flushCombo);

    // let stringifiedCombo = stringifyCombo(combos);

    return combos;
}

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

/**
 * Return index of item in multidimensional array that matches the inner array val of given index
 * @param {array} array 
 * @param {array} item
 * @param {number} checkIndex an index of inner-dimension of an array 
 */
const findValueIndexInMultidimensionalArray = (array, item, checkIndex) => {
    let result = -1;

    array.forEach( (el, index) => {
        if(el[checkIndex] === item) {
            result = index;
        }
    })

    return result;
} 

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

/**
 * Get string with information about hand in strongest combination
 * @param {array} combos 
 * @returns {string}
 */
// const stringifyCombo = (combos) => {
//     let string = '';
//     combos.forEach( (combo, index) => {
//         switch(combo[1]) {
//             case 2: 
//                 if(index > 0) {
//                     string += ` and a pair of ${combo[0]}s`;
//                 } else {
//                     string += `Pair of ${combo[0]}s`;
//                 }
//                 break;
//             case 3: 
//                 if(index > 0) {
//                     string += ` and a three of a kind: ${combo[0]}s`;
//                 } else {
//                     string += `Three of a kind: ${combo[0]}s`;
//                 }
//                 break;
//             case 4: 
//                 if(index > 0) {
//                     string += ` and a four of a kind: ${combo[0]}s`;
//                 } else {
//                     string += `Four of a kind: ${combo[0]}s`;
//                 }
//                 break;
//             default: 
//                 string += 'No combo';                    
//         }
//     });

//     return string;
// }


const getValueCombos = (vals, colors) => {
    let combos = {
        pair: 0,
        three: 0,
        four: 0 
    }

    let combo = '';
    let highestThreeOfAKind = 0;
    let highestPair = 0;
    let secondHighestPair = 0;
    let flush = '';

    colors.forEach(color => {
        if(color[1] >= 5) {
            flush = color[0];
        } 
    })

    vals.forEach(e => {
        if(e[1] === 2) {
            if(e[0] > highestPair) {
                secondHighestPair = highestPair;
                highestPair = e[0];
            } else if(e[0] > secondHighestPair) {  
                secondHighestPair = e[0];
            }
            combos.pair++; 
        } else if(e[1] === 3) { 
            if(e[0] > highestThreeOfAKind) highestThreeOfAKind = e[0];
            combos.three++; 
        }
    });


    let totalCombos = combos.pair + combos.three;

    if(totalCombos === 2 && combos.pair && combos.three) {
        combo += `Full house ${translateCard(highestThreeOfAKind)}s and ${translateCard(highestPair)}s`;

    } else if(!flush) {
        if (totalCombos === 1 && combos.pair) {
            combo = `Pair of ${translateCard(highestPair)}s`;
        } else if(totalCombos === 2 && combos.pair === 2) {
            combo = `Two pairs of ${translateCard(highestPair)}s and ${translateCard(secondHighestPair)}s`;
        } else if(totalCombos === 1 && combos.three) {
            combo = `Three of a kind of ${translateCard(highestThreeOfAKind)}s`;
        }
    } else if(flush) {
        combo = `Flush of ${flush}`;
    }

    


    return combo;
}

const getFlushCombo = (cards) => {
    let occurances = [];

    cards.forEach(card => {
        let val = card[1];
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
    
    return occurances;
}

const translateCard = (cardVal) => {
    switch(cardVal) {
        case 11:
            return 'Jack';
        case 12:
            return 'Queen';
        case 13: 
            return 'King';
        case 14:
            return 'Ace';
        default:
            return `${cardVal}'`;
    }
}

export default getPlayerHand;