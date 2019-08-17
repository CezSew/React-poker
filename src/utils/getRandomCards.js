

const getRandomCards = (deck, cards) => {
    let generatedCards = [];
    let generatedIndexes = [];
    console.log('-------');
    console.log(`generate me: ${cards} cards, please`);

    while(cards) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        let card = deck[randomIndex];

        // make sure that card have not been generated before
        if(generatedIndexes.indexOf(randomIndex) === -1)  {
            generatedCards.push(card);
            generatedIndexes.push(randomIndex);
            cards--;
        } else {
            console.log(`Tried to generate ${randomIndex}, but whe had it generated in ${generatedIndexes}`)
        }
    
    }
    console.log('-------');
    return generatedCards;
}

export default getRandomCards;