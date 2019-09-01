const getPlayerHand = (cards) => {
    let valuesAndSuits = checkValues(cards);    
    let flushCombo = getFlushCombo(cards);
    let combos = getValueCombos(valuesAndSuits, flushCombo, cards);
    // let playerHand = combos[0];
    // let stringifiedCombo = stringifyCombo(combos);
    console.log(combos)
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


const changeAcesValues = (cards) => {
    cards.forEach(card => {
        let cardValue = card[0];
        if(cardValue === 1) card[0] = 14;
    })

    return cards;
}

/**
 * Get chain of consecutive cards in values
 * @param {array} cardsArray
 * @returns {array} array of cards in straight 
 */

const getStraight = (cardsArray) => {
    let cards = [...cardsArray];
    let straight = [];
    let colors = [];

    let valsSum = 0;
    cards.forEach(el => valsSum += el[0]); // get sum of vals

    if(valsSum > 40) { // if vals sum is more than 40, there is no mathematical chance for wheel straight to occur, so change 1's to 14's
        cards = changeAcesValues(cards);
    }   
    
    let sortedVals = cards.sort((a, b) => { // sort array for straight check
        return a[0] - b[0];
    });
    
    for(let i = 0; i < sortedVals.length - 1; i++) { // check if there is straight
        if(sortedVals[i][0] !== sortedVals[i + 1][0] && sortedVals[i][0] + 1 === sortedVals[i + 1][0]) {
            if(straight.indexOf(sortedVals[i][0]) === -1) {
                straight.push(sortedVals[i][0]);
                colors.push(sortedVals[i][1]);
            };
            if(straight.indexOf(sortedVals[i + 1][0]) === -1) {
                straight.push(sortedVals[i + 1][0]);
                colors.push(sortedVals[i + 1][1]);
            } 
        } else if(sortedVals[i][0] !== sortedVals[i + 1][0] && straight.length !== 5){
            straight = [];
        }
    }

    let result = straight.map((val, i) => {
        return [val, colors[i]];
    })

    return result.splice(0, 5);
}
const getFlushName = (colors) => {
    let flush;
    colors.forEach(color => {
        if(color[1] >= 5) {
            flush = color[0];
        } 
    })
    
    return flush;
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
    let flush = getFlushName(colors);
    let playerHand = [];
    let straight = getStraight(cards);

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

    if(combos.four) { // quads
        combo += `Quad ${translateCard(quads)}s`;
        playerHand = getStrongestHand([quads, quads, quads, quads], cards);
    } else if(totalCombos === 2 && combos.pair && combos.three) {    // full house
        combo += `Full house ${translateCard(highestThreeOfAKind)}s and ${translateCard(highestPair)}s`;
        playerHand = getStrongestHand([highestThreeOfAKind, highestThreeOfAKind, highestThreeOfAKind, highestPair, highestPair], cards, true);
    } else if(!flush) {
        if(straight.length === 5) { // straight
            playerHand = straight;
            combo = `Straight, ${translateCard(playerHand[0][0])} to ${translateCard(playerHand[playerHand.length - 1][0])}`;
        } else if (totalCombos === 1 && combos.pair) { // pair
            combo = `Pair of ${translateCard(highestPair)}s`;
            playerHand = getStrongestHand([highestPair, highestPair], cards);
        } else if(totalCombos === 2 && combos.pair >= 2) { // two pair
            combo = `Two pairs of ${translateCard(highestPair)}s and ${translateCard(secondHighestPair)}s`;
            playerHand = getStrongestHand([highestPair, highestPair, secondHighestPair, secondHighestPair], cards);
        } else if(totalCombos === 1 && combos.three) { // three of a kind
            combo = `Three of a kind of ${translateCard(highestThreeOfAKind)}s`;
            playerHand = getStrongestHand([highestThreeOfAKind, highestThreeOfAKind, highestThreeOfAKind], cards);
        } else { // high card
            let cardsOrderedByValue = orderCardsByValue(cards); 
            combo = `High card ${translateCard(cardsOrderedByValue[0][0])}`;
            playerHand = cardsOrderedByValue;
        }
    } else if(flush) { //flush
        combo = `Flush of ${translateSuit(flush)}`;
        playerHand = getFlushCards(flush, cards);
    } 
    return [playerHand, combo];
}

const orderCardsByValue = (cards) => {
    let orderedCards = [...cards];
    orderedCards.forEach(card => { //translate aces
        if(card[0] === 1) card[0] = 14;
    });
    orderedCards.sort((a, b) => { return b[0] - a[0]; }); //sort
    orderedCards.forEach(card => { //translate aces back
        if(card[0] === 14) card[0] = 1;
    });
    return orderedCards.splice(0, 5);
}

const getStrongestHand = (combo, cards, fullHouse) => {
    let usedCards = [];
    if(combo.length !== 5 || fullHouse) {
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
        
        usedCards.forEach(card => {
            if(card[0] === 14) card[0] = 1;
        })
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

const getFlushCards = (flush, cards) => {
    let hand = cards.filter( card => {
        if(card[1] === flush) {
            return true;
        } else {
            return false;
        }
    });
    return orderCardsByValue(hand);
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

const translateSuit = (color) => {
    switch(color) {
        case 'c':
            return 'clubs';
        case 'd':
            return 'diamonds';
        case 's': 
            return 'spades';
        case 'h':
            return 'hearts';
        default:
            return '';
    }
}

export default getPlayerHand;