import React, {useContext} from 'react';
import {BoardProps} from 'boardgame.io/react';
import {
  GameStatePlayerView,
  Moves,
  PhaseID,
  PlayerID,
} from '../../shared/contre';
import {I18nContext} from '../context/i18n';

type ComponentProps = {
  playerSaid: BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>['G']['playersSaid'][PlayerID.North],
};
export const PlayerSaidComponent: React.FunctionComponent<ComponentProps> = ({
  playerSaid,
}) => {
  const rootElementClassName = 'playerSaid';

  const i18n = useContext(I18nContext);

  if (!playerSaid) {
    return null;
  }

  if (playerSaid === 'skip') {
    return <div className={rootElementClassName}>{i18n.PlayerSaid.skip}</div>;
  }

  if (playerSaid === 'contre') {
    return <div className={rootElementClassName}>{i18n.PlayerSaid.contre}</div>;
  }

  if (playerSaid === 'surcontre') {
    return <div className={rootElementClassName}>{i18n.PlayerSaid.surcontre}</div>;
  }

  return (
    <div className={rootElementClassName}>{`${playerSaid.expectedPoints} ${i18n.trumpMode[playerSaid.trumpMode]}`}</div>
  );
};
