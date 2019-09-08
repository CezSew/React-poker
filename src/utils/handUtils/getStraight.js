import changeAcesValues from './changeAcesValues';

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

export default getStraight;