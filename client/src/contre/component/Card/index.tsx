import React, {useContext} from 'react';
import {Card, SecretCard, CardColor} from '../../../shared/contre';
import {ThemeContext} from '../../context/theme';
import {UnicodeCardComponent} from './UnicodeCard';
import { SvgCardComponent, SvgSuitComponent, SvgMiniCardComponent } from './SvgCard';

export type PlayCardState =
  | 'playable' // when the player must play a card and the card is playable
  | 'forbidden' // when the player must play a card and the card is not playable
;

export type CardComponentProps = {
  card: Card | SecretCard,
  playCardState?: PlayCardState,
  isTrump?: boolean,
  onCardClick?: () => void,
  onSayBelotClick?: () => void,
  onDontSayBelotClick?: () => void,
  style?: object,
};
export const CardComponent: React.FunctionComponent<CardComponentProps> = (props) => {
  const theme = useContext(ThemeContext);

  switch (theme.cardDisplay) {
    case 'unicode':
      return <UnicodeCardComponent {...props}/>;
    case 'svg':
      return <SvgCardComponent {...props} />;
  }
};

export type SuitComponentProps = {
  cardColor: CardColor | undefined,
  onSuitClick?: () => void,
  size?: 'normal' | 'small' | 'big'
}

export const SuitComponent: React.FunctionComponent<SuitComponentProps> = (props) => {
  const theme = useContext(ThemeContext);

  switch (theme.cardDisplay) {
    case 'unicode':
      return null;
    case 'svg':
      return <SvgSuitComponent {...props} />;
  }
};
export type MiniCardComponentProps = {
  card: Card,
  isTrump?: boolean,
  isWinner?: boolean,
  style?: object,
};

export const MiniCardComponent: React.FunctionComponent<MiniCardComponentProps> = (props) => {
  const theme = useContext(ThemeContext);

  switch (theme.cardDisplay) {
    case 'unicode':
      return null;
    case 'svg':
      return <SvgMiniCardComponent {...props} />;
  }
};
