
const decideWinner = (playersHands) => {
    let winner = '';
    let playersCount = playersHands.length;

    for(let i = 0; i < playersCount - 1; i++) {
        if(playersHands[i][2] > playersHands[i + 1][2]) {
            winner = i;
        } else if(playersHands[i][2] < playersHands[i + 1][2]) {
            winner = i + 1;
        } else {

        }
    }
    
    return winner;
}

export default decideWinner;