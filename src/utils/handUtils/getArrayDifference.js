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

export default getArrayDifference;