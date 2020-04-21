import React from 'react';
import {
  Card,
  GameState,
  isPlayableCard,
  isSameCard,
  Moves,
  PlayerID,
  TrumpMode,
  getCardColorAssociatedToTrumpMode,
} from '../../shared/contre';
import {sortCards} from '../service/sortCards';
import {CardComponent} from './Card';

type ComponentProps = {
  cards: Card[],
  isMyTurnToPlayACard: boolean,
  playCard: (card: Card) => void,
  trumpMode: TrumpMode | undefined,
  playersCardPlayedInCurrentTurn: GameState['playersCardPlayedInCurrentTurn'],
  firstPlayerInCurrentTurn: PlayerID,
  playerPartner: PlayerID,
  sayBelotOrNot: Moves['sayBelotOrNot'],
  belotCards: Card[],
};
export const MyCardsComponent: React.FunctionComponent<ComponentProps> = ({
  cards,
  isMyTurnToPlayACard,
  playCard,
  trumpMode,
  playersCardPlayedInCurrentTurn,
  firstPlayerInCurrentTurn,
  playerPartner,
  sayBelotOrNot,
  belotCards,
}) => {
  var styles = [
    { zIndex: 1014, transform: 'rotate(-4deg)' },
    { zIndex: 1015, transform: 'rotate(4deg)' },
    { zIndex: 1013, transform: 'rotate(-6deg) translateY(5px)' },
    { zIndex: 1016, transform: 'rotate(6deg) translateY(5px)' },
    { zIndex: 1012, transform: 'rotate(-8deg) translateY(13px)' },
    { zIndex: 1017, transform: 'rotate(8deg) translateY(12px)' },
    { zIndex: 1011, transform: 'rotate(-10deg) translateY(22px)' },
    { zIndex: 1018, transform: 'rotate(10deg) translateY(22px)' },
  ];
  var cardStyles = styles.slice(0, cards.length).sort((a,b) => a.zIndex - b.zIndex);

  return (
    <div className="myCards">
      {sortCards(cards).map((card, index) => {
        const key = `${card.color}${card.name}`;
        const isBelotCard = belotCards.some(bc => isSameCard(bc, card));
        const isTrump = trumpMode && card.color === getCardColorAssociatedToTrumpMode(trumpMode);
        const playCardState = (isMyTurnToPlayACard && trumpMode)
          ? (isPlayableCard(card, cards, trumpMode, playersCardPlayedInCurrentTurn, firstPlayerInCurrentTurn, playerPartner) ? 'playable' : 'forbidden')
          : undefined;
        const onCardClick = (playCardState === 'playable' && !isBelotCard) ? () => playCard(card) : undefined;
        const onSayBelotClick = (playCardState === 'playable' && isBelotCard) ? () => {
          sayBelotOrNot(true);
          playCard(card);
        } : undefined;
        const onDontSayBelotClick = (playCardState === 'playable' && isBelotCard) ? () => {
          sayBelotOrNot(false);
          playCard(card);
        } : undefined;

        return (
          <CardComponent
            style={cardStyles[index]}
            key={key}
            card={card}
            isTrump={isTrump}
            playCardState={playCardState}
            onCardClick={onCardClick}
            onSayBelotClick={onSayBelotClick}
            onDontSayBelotClick={onDontSayBelotClick}
          />
        );
      })}
    </div>
  );
};
