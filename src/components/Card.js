import React from 'react';

const Card = ({card}) => {
    return <li key={card} className="app__card card"><img className="card__face" src={`../img/cards/${card.toString().replace(',', '')}.svg`} alt={card}/></li>;
}

export default Card;