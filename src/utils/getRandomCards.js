

const getRandomCards = (deck, cards) => {
    let generatedCards = [];
    let generatedIndexes = [];
    while(cards) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        let card = deck[randomIndex];

        // make sure that card have not been generated before
        if(generatedIndexes.indexOf(randomIndex) === -1)  {
            generatedCards.push(card);
            generatedIndexes.push(randomIndex);
            cards--;
        } else {
            console.log(`Tried to generate ${randomIndex}, but we had it generated in ${generatedIndexes}`)
        }
    
    }
    return generatedCards;
}

export default getRandomCards;