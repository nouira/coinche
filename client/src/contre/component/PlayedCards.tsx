import React from 'react';
import {Card, PlayerID, TrumpMode, getCardColorAssociatedToTrumpMode} from '../../shared/contre';
import {CardComponent} from './Card';
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
