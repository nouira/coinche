import { Context } from 'boardgame.io/core';
import {
  GameState,
  PlayerID,
  PhaseID,
} from '../index';

export default (
  G: GameState,
  ctx: Context<PlayerID, PhaseID>,
  playerID: PlayerID,
): void => {
  G.resultsConfirmations[playerID] = true;
  ctx.events.endStage();
  if(ctx.currentPlayer == playerID)
    ctx.events.endTurn();
};
