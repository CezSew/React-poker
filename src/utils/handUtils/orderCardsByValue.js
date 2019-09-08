/**
 * Order cards array according to their values
 * @param {array} cards
 * @returns {array} returns five cards of biggest values 
 */
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

export default orderCardsByValue;