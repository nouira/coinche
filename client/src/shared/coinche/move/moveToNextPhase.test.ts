import { Context } from 'boardgame.io/core';
import {
  GameState,
  PhaseID,
  PlayerID,
} from '../index';
import moveToNextPhase from './moveToNextPhase';
import { getDefaultContext, getDefaultGameState } from './__testHelper';

describe(`move/moveToNextPhase`, () => {
  let G: GameState;
  let ctx: Context<PlayerID, PhaseID>;

  beforeEach(() => {
    G = getDefaultGameState();
    ctx = getDefaultContext();
  });

  it(`sets __canMoveToNextPhase to true`, () => {
    G = {
      ...G,
      __canMoveToNextPhase: false,
    };

    moveToNextPhase(G, ctx);

    expect(G.__canMoveToNextPhase).toBe(true);
  });
});