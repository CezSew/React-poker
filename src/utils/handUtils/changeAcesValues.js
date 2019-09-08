/**
 * Switch aces values from 1 to 14 for value comparisons
 * @param {array} cards
 * @returns {array} 
 */
const changeAcesValues = (cards) => {
    cards.forEach(card => {
        let cardValue = card[0];
        if(cardValue === 1) card[0] = 14;
    })

    return cards;
}

export default changeAcesValues;