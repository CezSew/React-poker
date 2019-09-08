
const decideWinner = (playersHands) => {
    let winner = '';
    let playersCount = playersHands.length;

    for(let i = 0; i < playersCount - 1; i++) {
        if(playersHands[i][2] > playersHands[i + 1][2]) {
            winner = i;
        } else if(playersHands[i][2] < playersHands[i + 1][2]) {
            winner = i + 1;
        } else{
            winner = getBestHandIndex(playersHands);
        }
    }
    
    return winner;
}

const getBestHandIndex = (hands) => {
    let vals = [];

    hands.forEach((hand, index) => {
        vals[index] = 0;
        hand[0].forEach(card => {
            let val = Number(card[0]);
            if(Number(card[0]) === 1) {
                val = 14;
            }
            vals[index] += val;
        });
    });
    
    if(vals[0] > vals[1]) {
        return 0;
    } else if(vals[1] > vals[0]) {
        return 1;
    } else {
        return -1;
    }
}

export default decideWinner;