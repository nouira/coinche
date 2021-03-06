import { Context } from 'boardgame.io/core';
import {
  GameState,
  PlayerID,
  PhaseID,
} from '../index';

export default (
  G: GameState,
  ctx: Context<PlayerID, PhaseID>,
): void => {
  if (!G.currentSayTake || G.currentSayTake.sayCoincheLevel === 'surcoinche') {
    throw new Error();
  }

  G.numberOfSuccessiveSkipSaid = 0;

  if (G.currentSayTake.sayCoincheLevel === 'coinche') {
    G.currentSayTake.sayCoincheLevel = 'surcoinche';
    G.playersSaid = {
      ...G.playersSaid,
      [ctx.currentPlayer]: 'surcoinche',
    };
    return;
  }

  G.currentSayTake.sayCoincheLevel = 'coinche';
  G.playersSaid = {
    ...G.playersSaid,
    [ctx.currentPlayer]: 'coinche',
  };
};
