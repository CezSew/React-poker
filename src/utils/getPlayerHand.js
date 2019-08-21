const getPlayerHand = (cards) => {
    let valuesAndSuits = checkValues(cards);    
    let flushCombo = getFlushCombo(cards);
    let combos = getValueCombos(valuesAndSuits, flushCombo, cards);
    let playerHand = combos[0];
    // let stringifiedCombo = stringifyCombo(combos);

    console.log(playerHand)
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

const changeAcesValues = (cards) => {
    cards.forEach(card => {
        let cardValue = card[0];
        if(cardValue === 1) card[0] = 14;
    })

    return cards;
}

const getStraight = (cardsArray) => {
    let cards = [...cardsArray];
    let straight = [];

    // SWITCH ACES VALUE

    // get sum of vals
    let valsSum = 0;
    cards.forEach(el => valsSum += el[0]);

    // if vals sum is more than 40, there is no mathematical chace for wheel straight to occur, so change 1's to 14's

    if(valsSum > 40) {
        cards = changeAcesValues(cards);
    }   

    // sort array for straight check
    let sortedVals = cards.sort((a, b) => {
        return a[0] - b[0];
    });

    // check if there is straight
    for(let i = 0; i < sortedVals.length - 1; i++) {
        if(sortedVals[i][0] !== sortedVals[i + 1][0] && sortedVals[i][0] + 1 === sortedVals[i + 1][0]) {
            if(straight.indexOf(sortedVals[i][0]) === -1) straight.push(sortedVals[i][0]);
            if(straight.indexOf(sortedVals[i + 1][0]) === -1) straight.push(sortedVals[i + 1][0]);
        } else if(sortedVals[i][0] !== sortedVals[i + 1][0] && straight.length !== 5){
            straight = [];
        }
    }

    return straight;
}

const getValueCombos = (vals, colors, cards) => {
    let combos = {
        pair: 0,
        three: 0,
        four: 0 
    }

    let combo = '';
    let highestThreeOfAKind = 0;
    let highestPair = 0;
    let secondHighestPair = 0;
    let quads = '';
    let flush = '';

    let playerHand = [];

    colors.forEach(color => {
        if(color[1] >= 5) {
            flush = color[0];
        } 
    })

    vals.forEach(e => {
        if(e[1] === 2) {
            if(e[0] === 1) e[0] = 14;
            if(e[0] > highestPair) {
                secondHighestPair = highestPair;
                highestPair = e[0];
            } else if(e[0] > secondHighestPair) {  
                secondHighestPair = e[0];
            }
            if (combos.pair < 2) combos.pair++; 
        } else if(e[1] === 3) { 
            if(e[0] > highestThreeOfAKind) highestThreeOfAKind = e[0];
            combos.three++; 
        }
        else if(e[1] === 4) { 
            combos.four++; 
            quads = e[0];
        }
    });

    let totalCombos = combos.pair + combos.three;

    // is royal flush

    // is four of a kind

    // is full house

    // is flush

    // is straight
    // console.log(getStraight(cards))


    // is three of a kind

    // is two pair

    // is one pair

    // high card

    if(combos.four) {
        combo += `Quad ${translateCard(quads)}s`;
        playerHand = getStrongestHand(quads, cards);
    } else if(totalCombos === 2 && combos.pair && combos.three) {
        combo += `Full house ${translateCard(highestThreeOfAKind)}s and ${translateCard(highestPair)}s`;
        playerHand = getStrongestHand([quads, quads, quads, quads], cards);
    } else if(!flush) {
        if(getStraight(cards).length === 5) {
            playerHand = getStrongestHand(getStraight(cards), cards);
            combo = `Straight!`;
        } else if (totalCombos === 1 && combos.pair) {
            combo = `Pair of ${translateCard(highestPair)}s`;
            playerHand = getStrongestHand([highestPair, highestPair], cards);
        } else if(totalCombos === 2 && combos.pair >= 2) {
            combo = `Two pairs of ${translateCard(highestPair)}s and ${translateCard(secondHighestPair)}s`;
            playerHand = getStrongestHand([highestPair, highestPair, secondHighestPair, secondHighestPair], cards);
        } else if(totalCombos === 1 && combos.three) {
            combo = `Three of a kind of ${translateCard(highestThreeOfAKind)}s`;
            playerHand = getStrongestHand([highestThreeOfAKind, highestThreeOfAKind, highestThreeOfAKind], cards);
        }
    } else if(flush) {
        combo = `Flush of ${flush}`;
        playerHand = getStrongestHand(flush, cards);
    }

    return [playerHand, combo];
}


const getStrongestHand = (combo, cards) => {
    let usedCards = [];

    if(combo.length !== 5) {
        cards.forEach(card => {
            combo.forEach(val => {
                if(card[0] === val) {
                    let existsInArray = false;
                    usedCards.forEach(el => {
                        if(el[0] === card[0] && el[1] === card[1]) {
                            existsInArray = true;
                        }
                    })
                    if(!existsInArray) usedCards.push([card[0], card[1]]);
                }
            })
        })
        let unusedCards = getArrayDifference(cards, usedCards).map(el => { 
            if(el[0] === 1) { 
                el[0] = 14; 
            } 
            return [el[0], el[1]];
        });
        let bestRemainingCards = unusedCards.sort((a, b) => { return b[0] - a[0]; }).slice(0, 5 - combo.length);
        
        // turn aces into proper val
        bestRemainingCards.forEach(card => {
            if(card[0] === 14) card[0] = 1;
        })
        
        return [...usedCards, ...bestRemainingCards];
    } else {
        return [];
    }
}

const getArrayDifference = (cards, usedCards) => {
    let unusedCards = [];
    cards.forEach((card, index) => {
        let found = false;
        usedCards.forEach(usedCard => {
            if(card[0] === usedCard[0] && card[1] === usedCard[1]) found = true;
        });

        if(!found) {
            unusedCards.push([card[0], card[1]]);
        } 
    });

    return unusedCards;
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
        case 1:
            return 'Ace';
        default:
            return `${cardVal}'`;
    }
}

export default getPlayerHand;