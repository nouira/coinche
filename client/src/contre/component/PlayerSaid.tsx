import React, {useContext} from 'react';
import {BoardProps} from 'boardgame.io/react';
import {
  GameStatePlayerView,
  Moves,
  PhaseID,
  PlayerID,
  getCardColorAssociatedToTrumpMode,
} from '../../shared/contre';
import {I18nContext} from '../context/i18n';
import { Popover} from 'antd';
import { PlayerScreenPosition } from '../service/getPlayerIDForPosition';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { SuitComponent } from './Card';

type ComponentProps = {
  playerSaid: BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>['G']['playersSaid'][PlayerID.North],
  playerScreenPosition: PlayerScreenPosition,
};
export const PlayerSaidComponent: React.FunctionComponent<ComponentProps> = ({
  playerSaid,
  playerScreenPosition,
}) => {
  const i18n = useContext(I18nContext);

  var content = null;
  let placement : TooltipPlacement ;
  switch (playerScreenPosition) {
    case 'bottom':
      placement='top';
      break;
    case 'top':
      placement='bottom';
      break;
    case 'left':
      placement='topRight';
      break;
    case 'right':
      placement='topLeft';
      break;
  }

  if(playerSaid.length === 0)
    return null;

  content = (<div className='playerSaidStack'>
    {playerSaid.map((said, index) => {
      let opacity = 1 - (.2 * (playerSaid.length - index));
      let style = {opacity:opacity};
      if (said === 'skip') {
        return (<div style={style}>{i18n.PlayerSaid.skip}</div>);
      }
      else if (said === 'contre') {
        return (<div style={style}>{i18n.PlayerSaid.contre}</div>);
      }
      else if (said === 'surcontre') {
        return (<div style={style}>{i18n.PlayerSaid.surcontre}</div>);
      }
      else {
        return (
          <div className="playerSaidExpected" style={style}>
            <div>{said.expectedPoints}</div>
            <SuitComponent cardColor={getCardColorAssociatedToTrumpMode(said.trumpMode)} />
          </div>);
      }
    })}
  </div>);


  return (
    <Popover placement={placement} content={content} visible={true}>
      <div className="playerSaidHolder"></div>
    </Popover>
  );
};
