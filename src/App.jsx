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
    this.deck = utils.cardsDeck;
    this.keyCount = 0;

    this.initialState = {
      deck: utils.cardsDeck,
      remainingCards: this.deck,
      randomlySelectedCards: [],
      playerCards: [],
      opponentCards: [],
      board: [],
      playerHandString: '',
      opponentHandString: '',
      playerHand: [],
      opponentHand: [],
      gameStep: '',
      winner: ''
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
        playerCards: [],
        playerHandString: '',
        playerHand: [],
        opponentCards: [],
        opponentHand: [],
        opponentHandString: '',
        gameStep: '',
        winner: ''
      }
    );
  }

  render() {
    let board = this.state.board.map(card => <Card key={this.getKey()} card={card}/>);
    let playerCards = this.state.playerCards.map(card => <Card key={this.getKey()} card={card}/>);
    let opponentCards = this.state.opponentCards.map(card => <Card key={this.getKey()} card={card}/>);
    let strongestHand = this.state.playerHand.map(card => <Card key={this.getKey()} card={card}/>);
    let strongestOpponentHand = this.state.opponentHand.map(card => <Card key={this.getKey()} card={card}/>);
    return (
      <div className="app">
        <main className="app__table">
          <ul className="app__board">{board}</ul>
          <ul  className="app__hand app__hand--player">{playerCards}</ul>
          <ul  className="app__hand app__hand--opponent">{opponentCards}</ul>
        </main>
        <section className="app__controlls">
          {this.state.gameStep === '' && <button className="button button--action" onClick={this.getHands}>Deal the hands</button>}
          {this.state.gameStep === 'start' && <button className="button button--action"  onClick={(e) => this.hitThBoard(3, 'flop')}>Check</button>}
          {this.state.gameStep === 'flop' && <button className="button button--action" onClick={(e) => this.hitThBoard(1, 'turn')}>Check</button>}
          {this.state.gameStep === 'turn' && <button className="button button--action"  onClick={(e) => this.hitThBoard(1, 'river')}>Check</button>}
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

          {this.state.playerHandString && 
          <aside className="app__strongest-hand-wrapper app__strongest-hand-wrapper--opponent">
          Your opponent set of cards:
            <ul  className="app__strongest-hand">
              {strongestOpponentHand}
            </ul>  <br/>   
          {this.state.opponentHandString}
          
          </aside> }
         
        </section>
        
      </div>
    );
  }
}

export default App;
