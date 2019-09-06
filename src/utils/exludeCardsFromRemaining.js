
function exludeCardsFromRemaining (stateRemaining) {
    let remainingCards = [...stateRemaining];
    let funcArguments = Array.prototype.slice.call(arguments);
    let cards = funcArguments.splice(1, funcArguments.length);
    
    cards.forEach(card => {
        let cardIndex = 0;

        for(let k = 0; k < remainingCards.length; k++) {
            if(remainingCards[k][0] === card[0] && remainingCards[k][1] === card[1]) {
                cardIndex = k;
                remainingCards.splice(cardIndex, 1);
            }
        } 

    });


    return remainingCards;
}

export default exludeCardsFromRemaining;