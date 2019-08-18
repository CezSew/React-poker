import React from 'react';
import './css/reset.css';
import './css/App.css';
import * as utils from './utils/index';
import Card from './components/Card';
// import { Route, Switch, BrowserRouter,Redirect   } from 'react-router-dom';


class App extends React.Component {
  constructor() {
    super();

    this.getRandomCard = this.getRandomCard.bind(this);
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
      board: []
    }

    this.state = this.initialState;
  }

  getKey(){
    return this.keyCount++;
  }
  
  getRandomCard() {
    let randomCard = utils.getRandomCards(this.state.remainingCards, 1);
    let remainingCards = utils.exludeCardsFromRemaining(this.state.remainingCards, ...randomCard);
  
    this.setState(
      {
        randomlySelectedCards: [...this.state.randomlySelectedCards, randomCard],
        remainingCards: remainingCards
      }
    );
  }

  getHands() {
    let randomCards = utils.getRandomCards(this.state.remainingCards, 2);
    let remainingCards = utils.exludeCardsFromRemaining(this.state.remainingCards, ...randomCards);

    this.setState(
      {
        randomlySelectedCards: [...this.state.randomlySelectedCards, ...randomCards],
        remainingCards: remainingCards,
        playerCards: [...randomCards]
      }
    );
  }

  hitThBoard(numberOfCards) {
    let randomCards = utils.getRandomCards(this.state.remainingCards, numberOfCards);
    let remainingCards = utils.exludeCardsFromRemaining(this.state.remainingCards, ...randomCards);
    let playerHand = utils.getPlayerHand([...utils.deepArrayClone(this.state.board), ...utils.deepArrayClone(randomCards), ...utils.deepArrayClone(this.state.playerCards)]);
    // let playerHand = utils.getPlayerHand([[9, "d"], [9, "c"], [12, "c"], [2, "d"], [2, "c"], [9, "s"], [9, "h"]]);
    this.setState(
      {
        randomlySelectedCards: [...this.state.randomlySelectedCards, ...randomCards],
        remainingCards: remainingCards,
        board: [...this.state.board, ...randomCards],
        playerHand: playerHand
      }
    );
  }

  shuffleTheDeck() {
    this.setState(
      {
        randomlySelectedCards: [],
        remainingCards: this.deck,
        board: [],
        playerCards: [],
        playerHand: ''
      }
    );
  }

  render() {
    let board = this.state.board.map(card => <Card key={this.getKey()} card={card}/>);
    let playerCards = this.state.playerCards.map(card => <Card key={this.getKey()} card={card}/>);
    return (
      <div className="app">
         <button onClick={(e) => this.hitThBoard(3)}>Get flop</button>
         <button onClick={(e) => this.hitThBoard(1)}>Get turn</button>
         <button onClick={(e) => this.hitThBoard(1)}>Get river</button>
         <button onClick={this.shuffleTheDeck}>Shuffle</button>
         <button onClick={this.getHands}>Get your cards!</button> <br/>
         <ul className="app__board">{board}</ul><br/>
         Your cards <br/>
         <ul  className="app__hand">{playerCards}</ul>
        <br />
         Your hand <br/>
         {this.state.playerHand}
      </div>
    );
  }
}

export default App;
