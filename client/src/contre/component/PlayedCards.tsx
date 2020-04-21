import React from 'react';
import {Card, PlayerID, TrumpMode, getCardColorAssociatedToTrumpMode} from '../../shared/contre';
import {CardComponent, MiniCardComponent} from './Card';
import {getPlayerIDForPosition} from '../service/getPlayerIDForPosition';

type ComponentProps = {
  bottomPlayerID: PlayerID,
  playedCards: Record<PlayerID, Card | undefined> | undefined,
  trumpMode: TrumpMode | undefined,
};
export const PlayedCardsComponent: React.FunctionComponent<ComponentProps> = ({
  bottomPlayerID,
  playedCards,
  trumpMode,
}) => {

  const bottomPlayerCard = playedCards && playedCards[bottomPlayerID];
  const topPlayerCard = playedCards && playedCards[getPlayerIDForPosition(bottomPlayerID, 'top')];
  const leftPlayerCard = playedCards && playedCards[getPlayerIDForPosition(bottomPlayerID, 'left')];
  const rightPlayerCard = playedCards && playedCards[getPlayerIDForPosition(bottomPlayerID, 'right')];

  return (
    <div className="playedCards">
      <div className="playedCard top">
        {topPlayerCard && <CardComponent card={topPlayerCard} isTrump={trumpMode && topPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)} />}
      </div>
      <div className="playedCard left">
        {leftPlayerCard && <CardComponent card={leftPlayerCard} isTrump={trumpMode && leftPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)} />}
      </div>
      <div className="playedCard right">
        {rightPlayerCard && <CardComponent card={rightPlayerCard} isTrump={trumpMode && rightPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)} />}
      </div>
      <div className="playedCard bottom">
        {bottomPlayerCard && <CardComponent card={bottomPlayerCard} isTrump={trumpMode && bottomPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)} />}
      </div>
    </div>
  );
};

type PlayedCardsMiniComponentProps = {
  bottomPlayerID: PlayerID,
  playedCards: Record<PlayerID, Card> | undefined,
  trumpMode: TrumpMode | undefined,
  winner: PlayerID | undefined,
};

export const PlayedCardsMiniComponent: React.FunctionComponent<PlayedCardsMiniComponentProps> = (
  {
    bottomPlayerID,
    playedCards,
    trumpMode,
    winner,
  }) => {
  if(!playedCards)
    return null;

  const bottomPlayerCard = playedCards[bottomPlayerID];
  const topPlayerID = getPlayerIDForPosition(bottomPlayerID, 'top');
  const topPlayerCard = playedCards[topPlayerID];
  const leftPlayerID = getPlayerIDForPosition(bottomPlayerID, 'left');
  const leftPlayerCard = playedCards[leftPlayerID];
  const rightPlayerID = getPlayerIDForPosition(bottomPlayerID, 'right');
  const rightPlayerCard = playedCards[rightPlayerID];

  return (
    <div className="playedMiniCards">
      <div className="top ">
        <MiniCardComponent
          card={topPlayerCard}
          isTrump={trumpMode && topPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)}
          isWinner={topPlayerID === winner}
        />
      </div>
      <div className="left">
        <MiniCardComponent
          card={leftPlayerCard}
          isTrump={trumpMode && leftPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)}
          isWinner={leftPlayerID === winner}
        />
      </div>
      <div className="right">
        <MiniCardComponent
          card={rightPlayerCard}
          isTrump={trumpMode && rightPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)}
          isWinner={rightPlayerID === winner}
        />
      </div>
      <div className="bottom">
        <MiniCardComponent
          card={bottomPlayerCard}
          isTrump={trumpMode && bottomPlayerCard.color === getCardColorAssociatedToTrumpMode(trumpMode)}
          isWinner={bottomPlayerID === winner}
        />
      </div>
    </div>
  );
};
