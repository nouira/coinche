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
  if (!G.currentSayTake || G.currentSayTake.sayContreLevel === 'surcontre') {
    throw new Error();
  }

  G.numberOfSuccessiveSkipSaid = 0;

  if (G.currentSayTake.sayContreLevel === 'contre') {
    G.currentSayTake.sayContreLevel = 'surcontre';
    G.playersSaid = {
      ...G.playersSaid,
      [ctx.currentPlayer]: [...G.playersSaid[ctx.currentPlayer], 'surcontre'],
    };
    return;
  }

  G.currentSayTake.sayContreLevel = 'contre';
  G.playersSaid = {
    ...G.playersSaid,
    [ctx.currentPlayer]: [...G.playersSaid[ctx.currentPlayer], 'contre'],
  };
};
