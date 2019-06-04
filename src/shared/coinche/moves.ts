import { Context } from 'boardgame.io/core';
import {GameState, TrumpMode, PlayerID, PhaseID, validExpectedPoints, validTrumpModes} from './index';

export const saySkip = (
  G: GameState,
  ctx: Context<PlayerID, PhaseID>,
): void => {
  G.numberOfSuccessiveSkipSaid++;
  ctx.events.endTurn();
};

export const sayTake = (
  G: GameState,
  ctx: Context<PlayerID, PhaseID>,
  expectedPoints: number,
  trumpMode: TrumpMode,
) => {
  if (!validExpectedPoints.includes(expectedPoints)) {
    throw new Error();
  }
  if (!validTrumpModes.includes(trumpMode)) {
    throw new Error();
  }

  G.numberOfSuccessiveSkipSaid = 0;
  G.expectedPoints = expectedPoints;
  G.trumpMode = trumpMode;
  ctx.events.endTurn();
};
