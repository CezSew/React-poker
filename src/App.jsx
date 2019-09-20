import React from 'react';
import './css/reset.css';
import './css/App.css';
import * as utils from './utils/index';
import Card from './components/Card';

class App extends React.Component {
  constructor() {
    super();

    this.getHands = this.getHands.bind(this);
    this.shuffleTheDeck = this.shuffleTheDeck.bind(this);
    this.getKey = this.getKey.bind(this);
    // this.makeBet = this.makeBet.bind(this);
    // this.AIdecide = this.AIdecide.bind(this);
    this.deck = utils.cardsDeck;
    this.keyCount = 0;

    this.initialState = {
      deck: utils.cardsDeck,
      remainingCards: this.deck,
      randomlySelectedCards: [],
      playerChips: 1000,
      playerCards: [],
      opponentCards: [],
      board: [],
      playerHandString: '',
      opponentHandString: '',
      playerHand: [],
      opponentHand: [],
      gameStep: '',
      winner: '',
      pot: 0,
      currentPlayer: 0,
      playerMoves: {player0: 0, player1: 0},
      playersBets: {player0: 0, player1: 0}
    }

    this.state = this.initialState;
  }

  getKey(){
    return this.keyCount++;
  }

  /**
   * Give players their cards and set the state
   */
  getHands() {
    let randomCards = utils.getRandomCards(this.state.remainingCards, 4);
    let remainingCards = utils.exludeCardsFromRemaining(this.state.remainingCards, ...randomCards);
   
    //get opponent hand
    let opponentRandomCards = randomCards.slice(0, 2);
    let playerRandomCards = randomCards.slice(2, 4);

    this.setState(
      {
        randomlySelectedCards: [...this.state.randomlySelectedCards, ...randomCards],
        remainingCards: remainingCards,
        playerCards: [...playerRandomCards],
        opponentCards: [...opponentRandomCards],
        gameStep: 'start'
      }
    );
  }

  mainController(cardsToHitBoard, nextGameStep, player) {
    /**
     * IF both players decided
     *    IF bets are equal
     *      hitThBoard(cardsToHitBoard, nextGameStep)
     *    ELSE 
     *      go to player with lower bet
     * ELSE 
     *    go to player who hadn't decided yet -> playerHandleAction(cardsToHitBoard, nextGameStep) OR AIdecide(cardsToHitBoard, nextGameStep)
     */
    let movesAreEqual = false;
    let betsAreEqual = false;

    const playerMoves = this.state.playerMoves;
    const playersBets = this.state.playersBets;
    
    let playerMovesArray = Object.keys(playerMoves).map((item) => {
      return [item, playerMoves[item]];
    });

    for(let i = 0; i < playerMovesArray.length - 1; i++) {
      if(playerMovesArray[i][1] === playerMovesArray[i+1][1]) {
        movesAreEqual = true;
      }
    }
    
    let playersBetsArray = Object.keys(playersBets).map((item) => {
      return [item, playersBets[item]];
    });
    for(let i = 0; i < playersBetsArray.length - 1; i++) {
      if(playersBetsArray[i][1] === playersBetsArray[i+1][1]) {
        betsAreEqual = true;
      }
    }
    
    if(movesAreEqual && betsAreEqual) {
      this.hitThBoard(cardsToHitBoard, nextGameStep);
    } else {
      let nextPlayerToAct = player === 'player0' ? 'player1' : 'player0';
      this.playerHandleAction(cardsToHitBoard, nextGameStep, [], nextPlayerToAct);
    }
    
  }

  /**
   * Place newly generated cards on the board
   * @param {number} numberOfCards how many cards to generate 
   * @param {string} step name of gamestep to set when card hits the board
   */
  hitThBoard(numberOfCards, step) {
    let randomCards = utils.getRandomCards(this.state.remainingCards, numberOfCards);
    let remainingCards = utils.exludeCardsFromRemaining(this.state.remainingCards, ...randomCards);
    let playerHand = utils.getPlayerHand([...utils.deepArrayClone(this.state.board), ...utils.deepArrayClone(randomCards), ...utils.deepArrayClone(this.state.playerCards)]);
    let opponentHand = utils.getPlayerHand([...utils.deepArrayClone(this.state.board), ...utils.deepArrayClone(randomCards), ...utils.deepArrayClone(this.state.opponentCards)]);
    let winner = utils.decideWinner([[...playerHand], [...opponentHand]]);
    // let playerHand = utils.getPlayerHand([[2, "d"], [10, "d"], [14, "h"], [10, "c"], [3, "s"], [14, "c"], [9, "d"]]);

    this.setState(
      {
        randomlySelectedCards: [...this.state.randomlySelectedCards, ...randomCards],
        remainingCards: remainingCards,
        board: [...this.state.board, ...randomCards],
        playerHandString: playerHand[1],
        playerHand: playerHand[0],
        playerHandValue: playerHand[2],
        opponentHandString: opponentHand[1],
        opponentHand: opponentHand[0],
        opponentHandValue: opponentHand[2],
        gameStep: step,
        winner: winner
      }
    );

  }

  /**
   * Reset state
   */
  shuffleTheDeck() {
    this.setState(
      {
        randomlySelectedCards: [],
        remainingCards: this.deck,
        board: [],
        playerChips: 1000,
        playerCards: [],
        playerHandString: '',
        playerHand: [],
        opponentCards: [],
        opponentHand: [],
        opponentHandString: '',
        gameStep: '',
        winner: '',
        pot: 0,
        currentPlayer: 0,
        playerMoves: {player0: 0, player1: 0},
        playersBets: {player0: 0, player1: 0}
      }
    );
  }

  // ON PLAYER ACTION
  playerHandleAction(cards, gameStep, action = ['check', 0], player) {
    
    let betsAreEqual = false;
    let highestBet = 0;
    const playersBets = Object.assign({}, this.state.playersBets);
    let playersBetsArray = Object.keys(playersBets).map((item) => {
      return [item, playersBets[item]];
    });
    for(let i = 0; i < playersBetsArray.length - 1; i++) {
      let biggestBet = playersBetsArray[i][1] > playersBetsArray[i+1][1] ? playersBetsArray[i][1] : playersBetsArray[i+1][1];
      if(biggestBet > highestBet) { 
        highestBet = biggestBet; 
      }
      if(playersBetsArray[i][1] === playersBetsArray[i+1][1]) {
        betsAreEqual = true;
      }
    }

    if(player !== 'player0') {
      if(!betsAreEqual) {
        console.log('calls for  ' + (highestBet - this.state.playersBets.player1))
        action = ['call', highestBet - this.state.playersBets.player1];
      } else {
        action = ['check', 0];
      }
    } 

    let betSize = action[1];
    let playerMoves = Object.assign({}, this.state.playerMoves);
    playerMoves[player] += 1; 
    let updatedPlayerMoves = playerMoves;
    playersBets[player] += betSize;
    let updatedPlayersBets = playersBets;


    if(player !== 'player0') {
      console.log('OK, I ' + action[0])
      setTimeout(() => {
        this.setStateOnPlayerAction(updatedPlayerMoves, cards, gameStep, betSize, player, updatedPlayersBets);
      }, 1200);
    } else {
      this.setStateOnPlayerAction(updatedPlayerMoves, cards, gameStep, betSize, player, updatedPlayersBets);
    }

  }

  setStateOnPlayerAction(updatedPlayerMoves, cards, gameStep, betSize, player, updatedPlayersBets) {
    this.setState(
      {
        pot: this.state.pot + betSize,
        currentPlayer: this.state.currentPlayer === 0 ? 1 : 0,
        playersBets: updatedPlayersBets, 
        playerMoves: updatedPlayerMoves
      }, () => {
        console.log(this.state.playersBets)
        this.mainController(cards, gameStep, player)
      }
    );
  }

  render() {
    let board = this.state.board.map(card => <Card key={this.getKey()} card={card}/>);
    let playerCards = this.state.playerCards.map(card => <Card key={this.getKey()} card={card}/>);
    let opponentCards = this.state.opponentCards.map(card => <Card key={this.getKey()} card={this.state.gameStep === 'showdown' ? card : 'backface'}/>);
    let strongestHand = this.state.playerHand.map(card => <Card key={this.getKey()} card={card}/>);
    let strongestOpponentHand = this.state.opponentHand.map(card => <Card key={this.getKey()} card={card}/>);
    return (
      <div className="app">
        <main className="app__table">
          <ul className="app__board">
            {board}
            {this.state.gameStep === 'showdown' && (this.state.winner !== -1 
            ? (<span className="winner-info">Winner is player{this.state.winner}</span>) 
            : (<span className="winner-info">Split</span>) 
            ) }
          </ul>
          <ul  className="app__hand app__hand--player">{playerCards}</ul>
          <ul  className="app__hand app__hand--opponent">{opponentCards}</ul>
        </main>
        <section className="app__controlls">
          {this.state.gameStep === '' && <button className="button button--action" onClick={this.getHands}>Deal the hands</button>}
          {this.state.currentPlayer === 0 && this.state.gameStep === 'start' && (
            <React.Fragment>
              <button className="button button--action"  onClick={(e) => this.playerHandleAction(3, 'flop', ['check', 0], 'player0')}>Check</button>
              <button className="button button--shuffle" onClick={this.shuffleTheDeck}>Fold</button>
              <button className="button button--action" onClick={(e) => { this.playerHandleAction(3, 'flop', ['bet', 20], 'player0')}}>Bet (20)</button>
            </React.Fragment>)}
          {this.state.currentPlayer === 0 && this.state.gameStep === 'flop' && (
            <React.Fragment>
              <button className="button button--action" onClick={(e) => this.playerHandleAction(1, 'turn', ['check', 0], 'player0')}>Check</button>
              <button className="button button--shuffle" onClick={this.shuffleTheDeck}>Fold</button>
              <button className="button button--action" onClick={(e) => { this.playerHandleAction(1, 'turn', ['bet', 20], 'player0')}}>Bet (40)</button>
            </React.Fragment>)}
          {this.state.currentPlayer === 0 && this.state.gameStep === 'turn' && (
            <React.Fragment>
              <button className="button button--action"  onClick={(e) => this.playerHandleAction(1, 'river', ['check', 0], 'player0')}>Check</button>
              <button className="button button--shuffle" onClick={this.shuffleTheDeck}>Fold</button>
              <button className="button button--action" onClick={(e) => { this.playerHandleAction(1, 'river', ['bet', 20], 'player0')}}>Bet (80)</button>
            </React.Fragment>)}
          {this.state.currentPlayer === 0 && this.state.gameStep === 'river' && (
            <React.Fragment>
              <button className="button button--action"  onClick={(e) => this.hitThBoard(0, 'showdown', ['check', 0], 'player0')}>Showdown</button>
              <button className="button button--shuffle" onClick={this.shuffleTheDeck}>Fold</button>
              <button className="button button--action" onClick={(e) => { this.playerHandleAction(0, 'showdown', ['bet', 20], 'player0')}}>Bet (120)</button>
            </React.Fragment>)}
          <button className="button button--shuffle"  onClick={this.shuffleTheDeck}>Shuffle</button>
          
          <br />
          <br/><br/><br/>

          {this.state.playerHandString && 
          <aside className="app__strongest-hand-wrapper">
          Your strongest set of cards:
            <ul  className="app__strongest-hand">
              {strongestHand}
            </ul>  <br/>   
          {this.state.playerHandString}
          </aside> }

          {this.state.playerHandString && this.state.gameStep === 'showdown' &&
          <aside className="app__strongest-hand-wrapper app__strongest-hand-wrapper--opponent">
          Your opponent set of cards:
            <ul  className="app__strongest-hand">
              {strongestOpponentHand}
            </ul>  <br/>   
          {this.state.opponentHandString}
          
          </aside> }
          <div className="app__infobox">
            <p>currentPlayer: {this.state.currentPlayer}</p>
            <p>Pot: {this.state.pot} chips</p>
            <p>Your bet: {this.state.playersBets.player0} chips</p>
            <p>His bet: {this.state.playersBets.player1} chips</p>
          </div>
        </section>
        
      </div>
    );
  }
}

export default App;
