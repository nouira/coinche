import {Context} from 'boardgame.io/core';
import {GameState, PhaseID, PlayerID, TrumpMode} from '../index';
import sayContre from './sayContre';
import {getDefaultContext, getDefaultGameState} from './__testHelper';

describe(`move/sayContre`, () => {
  let G: GameState;
  let ctx: Context<PlayerID, PhaseID>;

  beforeEach(() => {
    G = {
      ...getDefaultGameState(),
      currentSayTake: {trumpMode: TrumpMode.TrumpSpade, expectedPoints: 82, playerID: PlayerID.North, sayContreLevel: undefined},
      numberOfSuccessiveSkipSaid: 3,
    };
    ctx = {
      ...getDefaultContext(),
      currentPlayer: PlayerID.North,
    };
  });

  it(`sets currentSayTake.sayContreLevel to 'contre' and resets number of successive skip said when currentSayTake.sayContreLevel is undefined`, () => {
    G = {
      ...G,
      currentSayTake: { ...G.currentSayTake!, sayContreLevel: undefined },
    };

    sayContre(G, ctx);

    expect(G.currentSayTake!.sayContreLevel).toBe('contre');
    expect(G.numberOfSuccessiveSkipSaid).toBe(0);
    expect(G.playersSaid).toEqual({
      ...getDefaultGameState().playersSaid,
      [PlayerID.North]: 'contre',
    });
  });

  it(`sets currentSayTake.sayContreLevel to 'surcontre' and resets number of successive skip said when currentSayTake.sayContreLevel is 'contre'`, () => {
    G = {
      ...G,
      currentSayTake: { ...G.currentSayTake!, sayContreLevel: 'contre' },
    };

    sayContre(G, ctx);

    expect(G.currentSayTake!.sayContreLevel).toBe('surcontre');
    expect(G.numberOfSuccessiveSkipSaid).toBe(0);
    expect(G.playersSaid).toEqual({
      ...getDefaultGameState().playersSaid,
      [PlayerID.North]: 'surcontre',
    });
  });

  it(`throws when currentSayTake.sayContreLevel is 'surcontre'`, () => {
    G = {
      ...G,
      currentSayTake: { ...G.currentSayTake!, sayContreLevel: 'surcontre' },
    };

    expect(() => {
      sayContre(G, ctx);
    }).toThrow();
  });
});
