import checkValues from './checkValues';
import findValueIndexInMultidimensionalArray from './findValueIndexInMultidimensionalArray';
import getStraight from './getStraight';
import getFlushName from './getFlushName';
import orderCardsByValue from './orderCardsByValue';
import getArrayDifference from './getArrayDifference';

const getPlayerHand = (cards) => {
    let valuesAndSuits = checkValues(cards);    
    let flushCombo = getFlushCombo(cards);
    let combos = getValueCombos(valuesAndSuits, flushCombo, cards);

    return combos;
}

/**
 * If there is a combo, this function will find it
 * @param {array} vals 
 * @param {array} colors 
 * @param {array} cards
 * @returns {array} return array of cards, combo as a string and numercal value of the combo 
 */
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
    let numericalComboValue = 0;

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
        numericalComboValue = 7;
    } else if(totalCombos === 2 && combos.pair && combos.three) {    // full house
        combo += `Full house ${translateCard(highestThreeOfAKind)}s and ${translateCard(highestPair)}s`;
        playerHand = getStrongestHand([highestThreeOfAKind, highestThreeOfAKind, highestThreeOfAKind, highestPair, highestPair], cards, true);
        numericalComboValue = 6;
    } else if(!flush) {
        if(straight.length === 5) { // straight
            playerHand = straight;
            combo = `Straight, ${translateCard(playerHand[0][0])} to ${translateCard(playerHand[playerHand.length - 1][0])}`;
            numericalComboValue = 4;
        } else if (totalCombos === 1 && combos.pair) { // pair
            combo = `Pair of ${translateCard(highestPair)}s`;
            playerHand = getStrongestHand([highestPair, highestPair], cards);
            numericalComboValue = 1;
        } else if(totalCombos === 2 && combos.pair >= 2) { // two pair
            combo = `Two pairs of ${translateCard(highestPair)}s and ${translateCard(secondHighestPair)}s`;
            playerHand = getStrongestHand([highestPair, highestPair, secondHighestPair, secondHighestPair], cards);
            numericalComboValue = 2;
        } else if(totalCombos === 1 && combos.three) { // three of a kind
            combo = `Three of a kind of ${translateCard(highestThreeOfAKind)}s`;
            playerHand = getStrongestHand([highestThreeOfAKind, highestThreeOfAKind, highestThreeOfAKind], cards);
            numericalComboValue = 3;
        } else { // high card
            let cardsOrderedByValue = orderCardsByValue(cards); 
            combo = `High card ${translateCard(cardsOrderedByValue[0][0])}`;
            playerHand = cardsOrderedByValue;
        }
    } else if(flush) { //flush
        combo = `Flush of ${translateSuit(flush)}`;
        playerHand = getFlushCards(flush, cards);
        numericalComboValue = 5;
    } 
    return [playerHand, combo, numericalComboValue];
}

/**
 * Get the best possible hand given board and player cards
 * @param {array} combo 
 * @param {array} cards 
 * @param {boolean} fullHouse 
 */
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