import {
  Context,
  Game,
  TurnOrder,
} from 'boardgame.io/core';
import saySkip from './move/saySkip';
import sayTake from './move/sayTake';
import playCard from './move/playCard';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export enum CardColor {
  Spade,
  Diamond,
  Heart,
  Club,
}
export const validCardColor = Object.values(CardColor).filter(k => typeof k === 'number');

export enum CardName {
  Ace,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
}
export const validCardName = Object.values(CardName).filter(k => typeof k === 'number');

export enum TrumpMode {
  TrumpSpade,
  TrumpDiamond,
  TrumpHeart,
  TrumpClub,
  NoTrump,
  AllTrump,
}
export const validTrumpModes = Object.values(TrumpMode).filter(k => typeof k === 'number');

export enum PlayerID {
  North = '0',
  East = '1',
  South = '2',
  West = '3',
}

export enum PhaseID {
  Deal = 'Deal',
  Talk = 'Talk',
  PlayCards = 'PlayCards',
  CountPoints = 'CountPoints',
}

export enum TeamID {
  NorthSouth = 'NorthSouth',
  EastWest = 'EastWest',
}

export interface Card {
  color: CardColor;
  name: CardName;
}

export interface GameState {
  // global state
  howManyPlayers: number;
  howManyCards: number;
  howManyPointsATeamMustReachToEndTheGame: number;
  howManyCardsToDealToEachPlayerBeforeTalking: number;
  howManyCardsToDealToEachPlayerAfterTalking: number;
  teamsPoints: Record<TeamID, number>;

  // round state
  availableCards: Card[];
  playedCards: Card[];
  playersCards: Record<PlayerID, Card[]>;
  turnOrder: PlayerID[];
  numberOfSuccessiveSkipSaid: number;
  dealer: PlayerID;
  nextDealer: PlayerID;
  expectedPoints?: number;
  trumpMode?: TrumpMode;

  // turn state
  firstPlayerInCurrentTurn: PlayerID;
  playersCardsPlayedInCurrentTurn: Record<PlayerID, Card | undefined>;
}

export interface Moves {
  saySkip: () => void;
  sayTake: (expectedPoints: number, mode: TrumpMode) => void;
  playCard: (card: Card) => void;
}

export type GameStatePlayerView = Omit<GameState, 'playersCards'> & {
  playerCards: Card[];
}

export const getCards = (): Card[] => [
  {
    color: CardColor.Spade,
    name: CardName.Ace,
  },
  {
    color: CardColor.Spade,
    name: CardName.Seven,
  },
  {
    color: CardColor.Spade,
    name: CardName.Eight,
  },
  {
    color: CardColor.Spade,
    name: CardName.Nine,
  },
  {
    color: CardColor.Spade,
    name: CardName.Ten,
  },
  {
    color: CardColor.Spade,
    name: CardName.Jack,
  },
  {
    color: CardColor.Spade,
    name: CardName.Queen,
  },
  {
    color: CardColor.Spade,
    name: CardName.King,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Ace,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Seven,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Eight,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Nine,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Ten,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Jack,
  },
  {
    color: CardColor.Diamond,
    name: CardName.Queen,
  },
  {
    color: CardColor.Diamond,
    name: CardName.King,
  },
  {
    color: CardColor.Heart,
    name: CardName.Ace,
  },
  {
    color: CardColor.Heart,
    name: CardName.Seven,
  },
  {
    color: CardColor.Heart,
    name: CardName.Eight,
  },
  {
    color: CardColor.Heart,
    name: CardName.Nine,
  },
  {
    color: CardColor.Heart,
    name: CardName.Ten,
  },
  {
    color: CardColor.Heart,
    name: CardName.Jack,
  },
  {
    color: CardColor.Heart,
    name: CardName.Queen,
  },
  {
    color: CardColor.Heart,
    name: CardName.King,
  },
  {
    color: CardColor.Club,
    name: CardName.Ace,
  },
  {
    color: CardColor.Club,
    name: CardName.Seven,
  },
  {
    color: CardColor.Club,
    name: CardName.Eight,
  },
  {
    color: CardColor.Club,
    name: CardName.Nine,
  },
  {
    color: CardColor.Club,
    name: CardName.Ten,
  },
  {
    color: CardColor.Club,
    name: CardName.Jack,
  },
  {
    color: CardColor.Club,
    name: CardName.Queen,
  },
  {
    color: CardColor.Club,
    name: CardName.King,
  },
];

const getTrumpModeAssociatedToCardColor = (color: CardColor): TrumpMode => {
  switch (color) {
    case CardColor.Spade:
      return TrumpMode.TrumpSpade;
    case CardColor.Diamond:
      return TrumpMode.TrumpDiamond;
    case CardColor.Heart:
      return TrumpMode.TrumpHeart;
    case CardColor.Club:
      return TrumpMode.TrumpClub;
  }
};

const getCardPoints = (card: Card, trumpMode: TrumpMode): number => {
  switch (card.name) {
    case CardName.Ace:
      return trumpMode === TrumpMode.NoTrump ? 19 : 11;
    case CardName.Nine:
      return trumpMode === getTrumpModeAssociatedToCardColor(card.color) ? 14 : 0;
    case CardName.Ten:
      return 10;
    case CardName.Jack:
      return trumpMode === getTrumpModeAssociatedToCardColor(card.color) ? 20 : 2;
    case CardName.Queen:
      return 3;
    case CardName.King:
      return 4;
    default:
      return 0;
  }
};

export const validExpectedPoints = [
  82,
  85,
  90,
  95,
  100,
  105,
  110,
  115,
  120,
  125,
  130,
  135,
  140,
  145,
  150,
  155,
  160,
  165,
  170,
  175,
  180,
  185,
  190,
  195,
  200,
  205,
  210,
  215,
  220,
  225,
  230,
  235,
  240,
  245,
  250,
];

const getTurnOrder = (dealer: PlayerID): PlayerID[] => {
  switch (dealer) {
    case PlayerID.North:
      return [PlayerID.North, PlayerID.West, PlayerID.South, PlayerID.East];
    case PlayerID.East:
      return [PlayerID.East, PlayerID.North, PlayerID.West, PlayerID.South];
    case PlayerID.South:
      return [PlayerID.South, PlayerID.East, PlayerID.North, PlayerID.West];
    case PlayerID.West:
      return [PlayerID.West, PlayerID.South, PlayerID.East, PlayerID.North];
  }
};

const getDefaultPlayersCards = () => ({
  [PlayerID.North]: [],
  [PlayerID.East]: [],
  [PlayerID.South]: [],
  [PlayerID.West]: [],
});

const getDefaultPlayersCardsPlayedInCurrentTurn = () => ({
  [PlayerID.North]: undefined,
  [PlayerID.East]: undefined,
  [PlayerID.South]: undefined,
  [PlayerID.West]: undefined,
});

export const getSetupGameState = (ctx: Context<PlayerID, PhaseID>, setupData: object): GameState => {
  const howManyPlayers = Object.keys(PlayerID).length;
  const dealer = PlayerID.North;
  const availableCards = getCards();
  const howManyCards = availableCards.length;
  const howManyCardsToDealToEachPlayerBeforeTalking = 6;
  const howManyCardsToDealToEachPlayerAfterTalking = Math.floor(howManyCards / howManyPlayers) - howManyCardsToDealToEachPlayerBeforeTalking;

  return {
    howManyPlayers,
    howManyCards,
    availableCards,
    playedCards: [],
    playersCards: getDefaultPlayersCards(),
    teamsPoints: {
      [TeamID.NorthSouth]: 0,
      [TeamID.EastWest]: 0,
    },
    dealer,
    nextDealer: dealer,
    turnOrder: getTurnOrder(dealer),
    firstPlayerInCurrentTurn: dealer,
    howManyCardsToDealToEachPlayerBeforeTalking,
    howManyCardsToDealToEachPlayerAfterTalking,
    howManyPointsATeamMustReachToEndTheGame: 2000,
    numberOfSuccessiveSkipSaid: 0,
    playersCardsPlayedInCurrentTurn: getDefaultPlayersCardsPlayedInCurrentTurn(),
  };
};

export const buildGame = () => Game<GameState, GameStatePlayerView, Moves, PlayerID, PhaseID>({
  setup: getSetupGameState,

  moves: {
    saySkip,
    sayTake,
    playCard,
  },

  flow: {
    endTurn: false,
    endPhase: false,
    endGame: false,
    turnOrder: TurnOrder.CUSTOM_FROM<GameState>('turnOrder'),
    startingPhase: PhaseID.Deal,
    phases: {
      [PhaseID.Deal]: {
        onPhaseBegin: (G, ctx) => {
          const newDealer = G.nextDealer;
          const newNextDealer = getTurnOrder(newDealer)[1];

          G.playedCards = [];
          G.expectedPoints = undefined;
          G.trumpMode = undefined;
          G.playersCards = getDefaultPlayersCards();
          G.dealer = newDealer;
          G.nextDealer = newNextDealer;
          G.firstPlayerInCurrentTurn = newNextDealer;
          G.availableCards = ctx.random.Shuffle(getCards());
          G.turnOrder.forEach(playerID => {
            for (let i = 0; i < G.howManyCardsToDealToEachPlayerBeforeTalking; i++) {
              const card = G.availableCards.pop();
              if (!card) {
                throw new Error();
              }
              G.playersCards[playerID].push(card);
            }
          });

          ctx.events.endTurn({ next: newNextDealer });
          ctx.events.endPhase({ next: PhaseID.Talk });
        },
        allowedMoves: [],
      },
      [PhaseID.Talk]: {
        allowedMoves: ['saySkip', 'sayTake'] as (keyof Moves)[],
        endPhaseIf: (G, ctx) => {
          if (G.numberOfSuccessiveSkipSaid >= G.howManyPlayers) {
            return { next: PhaseID.Deal };
          }
          if (G.expectedPoints && G.trumpMode && G.numberOfSuccessiveSkipSaid >= (G.howManyPlayers - 1)) {
            return { next: PhaseID.PlayCards };
          }

          return false;
        },
        onPhaseEnd: (G, ctx) => ({
          ...G,
          numberOfSuccessiveSkipSaid: 0,
        }),
      },
      [PhaseID.PlayCards]: {
        onPhaseBegin: (G, ctx) => {
          G.turnOrder.forEach(playerID => {
            for (let i = 0; i < G.howManyCardsToDealToEachPlayerAfterTalking; i++) {
              const card = G.availableCards.pop();
              if (!card) {
                throw new Error();
              }
              G.playersCards[playerID].push(card);
            }
          });
        },
        allowedMoves: [],
        endPhaseIf: (G, ctx) => {
          if (Object.values(G.playersCardsPlayedInCurrentTurn).every( card => typeof card !== 'undefined')) {
            return { next: PhaseID.CountPoints };
          }

          return false;
        },
        onPhaseEnd: (G, ctx) => ({
          ...G,
          playersCardsPlayedInCurrentTurn: getDefaultPlayersCardsPlayedInCurrentTurn(),
        }),
      },
      [PhaseID.CountPoints]: {
        allowedMoves: [],
        onPhaseBegin: (G, ctx) => {
          if (G.playedCards.length >= G.howManyCards) {
            // @TODO count turn points
            ctx.events.endPhase({ next: PhaseID.Deal });
            return;
          }

          // @TODO count cards points
          // @TODO set new firstPlayerInCurrentTurn depending on who won the last turn
          ctx.events.endPhase({ next: PhaseID.PlayCards });
        },
      },
    },
    endGameIf: (G, ctx) => {
      if (Object.entries(G.teamsPoints).every(([teamID, points]) => points < G.howManyPointsATeamMustReachToEndTheGame)) {
        return;
      }

      return true;
    },
  },

  playerView: ({ playersCards, ...GWithoutPlayers }, ctx, playerID): GameStatePlayerView => ({
    ...GWithoutPlayers,
    playerCards: playersCards ? playersCards[playerID] : [],
  }),
});
