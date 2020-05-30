import {
  Context,
  GameConfig,
  TurnConfig,
} from 'boardgame.io/core';
import endTurn from './move/endTurn';
import waitBeforeMovingToNextPhase from './move/waitBeforeMovingToNextPhase';
import moveToNextPhase from './move/moveToNextPhase';
import playCard from './move/playCard';
import sayBelotOrNot from './move/sayBelotOrNot';
import saySkip from './move/saySkip';
import sayTake from './move/sayTake';
import sayContre from './move/sayContre';
import {calculatePoints, getRoundResults} from './service/pointsCounter';
import {getTurnWinner} from './service/winnerResolver';

export enum CardColor {
  Spade = 'Spade',
  Diamond = 'Diamond',
  Heart = 'Heart',
  Club = 'Club',
}
export enum CardName {
  Ace = 'Ace',
  Seven = 'Seven',
  Eight = 'Eight',
  Nine = 'Nine',
  Ten = 'Ten',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
}
export interface Card {
  color: CardColor;
  name: CardName;
}
export type SecretCard = true; // SecretCard are Card with hidden properties
export const secretCard: SecretCard = true;

export enum TrumpMode {
  TrumpSpade = 'TrumpSpade',
  TrumpDiamond = 'TrumpDiamond',
  TrumpClub = 'TrumpClub',
  TrumpHeart = 'TrumpHeart'
}
export const validTrumpModes: TrumpMode[] = Object.values(TrumpMode);

export enum PlayerID {
  North = '0',
  East = '1',
  South = '2',
  West = '3',
}
export const howManyPlayers = Object.keys(PlayerID).length;

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

export type ExpectedPoints = 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160 | 170 | 180 | 250;
export const validExpectedPoints: ExpectedPoints[] = [90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 250];
export const Capot:ExpectedPoints = 250;

export interface BelotAnnounce {
  id: 'Belot';
  owner: PlayerID;
  ownerHasChosen: boolean;
  isSaid: boolean;
}
export interface PlayerAnnounce {
  isSaid: boolean;
  isCardsDisplayable: boolean;
}
export interface SecretPlayerAnnounce {
  isSaid: boolean;
  isCardsDisplayable: boolean;
}

export interface SayTakeLevel {
  expectedPoints: ExpectedPoints;
  trumpMode: TrumpMode;
}
export type SayContreLevel = 'contre' | 'surcontre';
export const ContreScoredPoints = 320;
export interface SayTake extends SayTakeLevel {
  playerID: PlayerID;
  sayContreLevel: SayContreLevel | undefined;
}
export interface TotalPointsDetails {
  ExtraPoints: number,
  CardsPoints: number,
  BelotAnnouncePoints: number,
  TotalPoints: number,
  RoundedTotalPoints: number,
  ScoredPoints: number,
}
export type ContractResult = 'failed' | 'succeeded';

export interface RoundResults {
  ContractResult: ContractResult | undefined;
  TeamsResult: Record<TeamID, TotalPointsDetails>;
}

export interface CurrentResult {
  lastTurnCards: Record<PlayerID, Card> | undefined;
  lastWinner: PlayerID | undefined;
  points: Record<TeamID, number>;
}
export type PlayerSaid = 'skip' | SayTakeLevel | SayContreLevel;
export interface GameState {
  // internal state
  __forcedNextPhase?: PhaseID;
  __isWaitingBeforeMovingToNextPhase: boolean;
  __canMoveToNextPhase: boolean;

  // global state
  howManyPointsATeamMustReachToEndTheGame: number;
  howManyCardsToDealToEachPlayerBeforeTalking: number;
  howManyCardsToDealToEachPlayerAfterTalking: number;
  teamsPoints: Record<TeamID, number>;

  // round state
  availableCards: Card[];
  playersCards: Record<PlayerID, Card[]>;
  resultsConfirmations: Record<PlayerID, boolean>;
  wonTeamsCards: Record<TeamID, Card[]>;
  dealer: PlayerID;
  nextDealer: PlayerID;
  attackingTeam: TeamID;
  defensingTeam: TeamID;
  playersSaid: Record<PlayerID, PlayerSaid[]>;
  lastPlayersTakeSaid: Record<PlayerID, SayTakeLevel | undefined>;
  numberOfSuccessiveSkipSaid: number;
  currentSayTake: SayTake | undefined;
  belotAnnounce: BelotAnnounce | undefined;
  roundResults: RoundResults;

  // turn state
  firstPlayerInCurrentTurn: PlayerID;
  playersCardPlayedInCurrentTurn: Record<PlayerID, Card | undefined>;
  playersCardPlayedInPreviousTurn: Record<PlayerID, Card> | undefined;
  currentResult: CurrentResult
}
// @TODO: hide belotAnnounce if not said
export type GameStatePlayerView = Omit<GameState, 'availableCards' | 'playersCards' | 'playersAnnounces'> & {
  availableCards: SecretCard[];
  playersCards: Record<PlayerID, Card[] | SecretCard[]>;
  playerCards: Card[]; // Contains G.playersCards[myPlayerID]
}

export interface Moves {
  endTurn: () => void;
  waitBeforeMovingToNextPhase: () => void;
  moveToNextPhase: () => void;
  saySkip: () => void;
  sayTake: (expectedPoints: ExpectedPoints, mode: TrumpMode) => void;
  sayContre: () => void;
  sayBelotOrNot: (sayIt: boolean) => void;
  playCard: (card: Card) => void;
  confirmResults: (playerId: PlayerID) => void;
}

export const getTrumpModeAssociatedToCardColor = (color: CardColor): TrumpMode => {
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
export const getCardColorAssociatedToTrumpMode = (trumpMode: TrumpMode): CardColor | undefined => {
  switch (trumpMode) {
    case TrumpMode.TrumpSpade:
      return CardColor.Spade;
    case TrumpMode.TrumpDiamond:
      return CardColor.Diamond;
    case TrumpMode.TrumpHeart:
      return CardColor.Heart;
    case TrumpMode.TrumpClub:
      return CardColor.Club;
  }
};

export const getPlayerPartner = (player: PlayerID): PlayerID => {
  switch (player) {
    case PlayerID.North:
      return PlayerID.South;
    case PlayerID.East:
      return PlayerID.West;
    case PlayerID.South:
      return PlayerID.North;
    case PlayerID.West:
      return PlayerID.East;
  }
};
export const getPlayerTeam = (player: PlayerID): TeamID => [PlayerID.North, PlayerID.South].includes(player) ? TeamID.NorthSouth : TeamID.EastWest;

export const isSayableExpectedPoints = (expectedPoints: ExpectedPoints, currentSayTakeExpectedPoints: ExpectedPoints | undefined): boolean => expectedPoints > (currentSayTakeExpectedPoints || 0);


export const getBelotCards = (trumpMode: TrumpMode): Card[] => {
  switch (trumpMode) {
    case TrumpMode.TrumpSpade:
      return [{ color: CardColor.Spade, name: CardName.King }, { color: CardColor.Spade, name: CardName.Queen }];
    case TrumpMode.TrumpDiamond:
      return [{ color: CardColor.Diamond, name: CardName.King }, { color: CardColor.Diamond, name: CardName.Queen }];
    case TrumpMode.TrumpHeart:
      return [{ color: CardColor.Heart, name: CardName.King }, { color: CardColor.Heart, name: CardName.Queen }];
    case TrumpMode.TrumpClub:
      return [{ color: CardColor.Club, name: CardName.King }, { color: CardColor.Club, name: CardName.Queen }];
  }
};
export const getBelotOwner = (trumpMode: TrumpMode, playersCards: GameState['playersCards']): PlayerID | undefined => {
  const belotCards = getBelotCards(trumpMode);
  if (!belotCards.length) {
    return;
  }

  const playerCardsContainingBelot = Object.entries(playersCards).find(([_, playerCards]) =>
    belotCards.every(bc => playerCards.some(pc => isSameCard(bc, pc))),
  );
  return playerCardsContainingBelot ? playerCardsContainingBelot[0] as PlayerID : undefined;
};

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
export const howManyCards = getCards().length;
export const isSameCard = (card: Card | undefined, otherCard: Card | undefined): boolean => {
  if (!card || !otherCard) {
    return false;
  }

  return card.color === otherCard.color && card.name === otherCard.name;
};
export const cardsContainCard = (cards: Card[], card: Card): boolean => cards.some(c => isSameCard(c, card));
export const isCardBeatingTheOtherCards = (card: Card, otherCards: Card[], trumpMode: TrumpMode, firstCardColor: CardColor): boolean => {
  if (!otherCards.length) {
    return true;
  }

  const cardColorAssociatedToTrumpMode = getCardColorAssociatedToTrumpMode(trumpMode);

  if (card.color === cardColorAssociatedToTrumpMode) {
    switch (card.name) {
      case CardName.Jack:
        return true;
      case CardName.Nine:
        return otherCards.every(({color, name}) => color !== cardColorAssociatedToTrumpMode || name !== CardName.Jack);
      case CardName.Ace:
        return otherCards.every(({color, name}) => color !== cardColorAssociatedToTrumpMode || ![CardName.Jack, CardName.Nine].includes(name));
      case CardName.Ten:
        return otherCards.every(({color, name}) => color !== cardColorAssociatedToTrumpMode || ![CardName.Jack, CardName.Nine, CardName.Ace].includes(name));
      case CardName.King:
        return otherCards.every(({color, name}) => color !== cardColorAssociatedToTrumpMode || ![CardName.Jack, CardName.Nine, CardName.Ace, CardName.Ten].includes(name));
      case CardName.Queen:
        return otherCards.every(({color, name}) => color !== cardColorAssociatedToTrumpMode || ![CardName.Jack, CardName.Nine, CardName.Ace, CardName.Ten, CardName.King].includes(name));
      case CardName.Eight:
        return otherCards.every(({color, name}) => color !== cardColorAssociatedToTrumpMode || ![CardName.Jack, CardName.Nine, CardName.Ace, CardName.Ten, CardName.King, CardName.Queen].includes(name));
      case CardName.Seven:
        return otherCards.every(({color}) => color !== cardColorAssociatedToTrumpMode);
    }
  }

  if (card.color !== firstCardColor) {
    return false;
  }

  switch (card.name) {
    case CardName.Ace:
      return otherCards.every(({ color }) => color !== cardColorAssociatedToTrumpMode);
    case CardName.Ten:
      return otherCards.every(({ color, name }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor && name === CardName.Ace);
      });
    case CardName.King:
      return otherCards.every(({ color, name }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor && [CardName.Ace, CardName.Ten].includes(name));
      });
    case CardName.Queen:
      return otherCards.every(({ color, name }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor && [CardName.Ace, CardName.Ten, CardName.King].includes(name));
      });
    case CardName.Jack:
      return otherCards.every(({ color, name }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor && [CardName.Ace, CardName.Ten, CardName.King, CardName.Queen].includes(name));
      });
    case CardName.Nine:
      return otherCards.every(({ color, name }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor && [CardName.Ace, CardName.Ten, CardName.King, CardName.Queen, CardName.Jack].includes(name));
      });
    case CardName.Eight:
      return otherCards.every(({ color, name }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor && [CardName.Ace, CardName.Ten, CardName.King, CardName.Queen, CardName.Jack, CardName.Nine].includes(name));
      });
    case CardName.Seven:
      return otherCards.every(({ color }) => {
        if (color === cardColorAssociatedToTrumpMode) {
          return false;
        }

        return !(color === firstCardColor);
      });
  }
};
export const isPlayableCard = (card: Card, playerCards: Card[], trumpMode: TrumpMode, playersCardPlayedInCurrentTurn: GameState['playersCardPlayedInCurrentTurn'], firstPlayerInCurrentTurn: PlayerID, playerPartner: PlayerID): boolean => {
  // if a card has already been played
  if (playersCardPlayedInCurrentTurn[firstPlayerInCurrentTurn]) {
    const firstCardColor = playersCardPlayedInCurrentTurn[firstPlayerInCurrentTurn]!.color;

    // if player has a card with same color than first card played
    if (
      card.color !== firstCardColor
      && playerCards.some(c => c.color === firstCardColor)
    ) {
      // must play a card of the same color
      return false;
    }

    const isSingleColorTrumpMode = [TrumpMode.TrumpSpade, TrumpMode.TrumpDiamond, TrumpMode.TrumpHeart, TrumpMode.TrumpClub].includes(trumpMode);
    const firstCardColorIsAssociatedToTrumpMode = firstCardColor === getCardColorAssociatedToTrumpMode(trumpMode);
    const otherCards = Object.values(playersCardPlayedInCurrentTurn).filter(c => c !== undefined) as Card[];

    // if single color trump mode
    // and player has a more powerful card
    // and player is trying to play a less powerful card
    if (
      isSingleColorTrumpMode
      && playerCards.some(c => isCardBeatingTheOtherCards(c, otherCards, trumpMode, firstCardColor))
      && !isCardBeatingTheOtherCards(card, otherCards, trumpMode, firstCardColor)
    ) {
      // if first card played is trump
      if (firstCardColorIsAssociatedToTrumpMode) {
        // must play a more powerful trump card
        return false;
      }

      const playerPartnerCard = playersCardPlayedInCurrentTurn[playerPartner];
      const currentWinningCard = getWinningCard(otherCards, trumpMode, firstCardColor);
      const currentWinningCardIsFromPartner = Boolean(playerPartnerCard && isSameCard(playerPartnerCard, currentWinningCard));

      // if current winning card is not from partner
      // and player does not have a card with same color than first card
      if (
        !currentWinningCardIsFromPartner
        && !playerCards.some(c => c.color === firstCardColor)
      ) {
        // must play a trump card
        return false;
      }
    }
  }

  return true;
};
export const getWinningCard = (cards: Card[], trumpMode: TrumpMode, firstCardColor: CardColor): Card => {
  if (!cards.length) {
    throw new Error();
  }

  return cards.reduce((currentWinningCard, card) => {
    if (!currentWinningCard) {
      return card;
    }

    if (isCardBeatingTheOtherCards(card, cards.filter(c => !isSameCard(c, card)), trumpMode, firstCardColor)) {
      return card;
    }

    return currentWinningCard;
  });
};

export const getWinner = (playersCardPlayedInCurrentTurn: Record<PlayerID, Card | undefined>, trumpMode: TrumpMode, firstCardColor: CardColor): PlayerID => {
  const winningCard = getWinningCard(
    Object.values(playersCardPlayedInCurrentTurn).filter(c => c !== undefined) as Card[],
    trumpMode,
    firstCardColor,
  );

  const winningPlayerCard = Object.entries(playersCardPlayedInCurrentTurn).find(([_, playerCard]) => isSameCard(winningCard, playerCard));
  if (!winningPlayerCard) {
    throw new Error(`Can't get winner`);
  }

  return winningPlayerCard[0] as PlayerID;
};
export const getGameWinnerTeam = (teamsPoints: Record<TeamID, number>, howManyPointsATeamMustReachToEndTheGame: number): TeamID | null | undefined => {
  if (Object.values(teamsPoints).every(points => points < howManyPointsATeamMustReachToEndTheGame)) {
    return;
  }

  if (teamsPoints[TeamID.NorthSouth] === teamsPoints[TeamID.EastWest]) {
    return null;
  }

  if (teamsPoints[TeamID.NorthSouth] >= teamsPoints[TeamID.EastWest]) {
    return TeamID.NorthSouth;
  }

  return TeamID.EastWest;
};

export const getTurnOrder = (firstPlayerID: PlayerID): PlayerID[] => {
  switch (firstPlayerID) {
    case PlayerID.North:
      return [PlayerID.North, PlayerID.West, PlayerID.South, PlayerID.East];
    case PlayerID.East:
      return [PlayerID.East, PlayerID.North, PlayerID.West, PlayerID.South];
    case PlayerID.South:
      return [PlayerID.South, PlayerID.East, PlayerID.North, PlayerID.West];
    case PlayerID.West:
      return [PlayerID.West, PlayerID.South, PlayerID.East, PlayerID.North];
    default:
      throw new Error(`Unsupported playerID [${firstPlayerID}]`);
  }
};

const getDefaultPlayersCards = () => ({
  [PlayerID.North]: [],
  [PlayerID.East]: [],
  [PlayerID.South]: [],
  [PlayerID.West]: [],
});
const getDefaultWonTeamsCards = () => ({
  [TeamID.NorthSouth]: [],
  [TeamID.EastWest]: [],
});
const getDefaultResults = () => ({
  ContractResult: undefined,
  TeamsResult: {
    [TeamID.NorthSouth]: {
      ExtraPoints: 0,
      CardsPoints: 0,
      BelotAnnouncePoints: 0,
      TotalPoints: 0,
      RoundedTotalPoints: 0,
      ScoredPoints: 0,
    },
    [TeamID.EastWest]: {
      ExtraPoints: 0,
      CardsPoints: 0,
      BelotAnnouncePoints: 0,
      TotalPoints: 0,
      RoundedTotalPoints: 0,
      ScoredPoints: 0,
    },
  },
});
const getDefaultTeamsPoints = () => ({
  [TeamID.NorthSouth]: 0,
  [TeamID.EastWest]: 0,
});
const getDefaultConfirmationsResult = () => ({
  [PlayerID.North]: false,
  [PlayerID.East]: false,
  [PlayerID.South]: false,
  [PlayerID.West]: false,
});
const getDefaultPlayersCardPlayedInCurrentTurn = () => ({
  [PlayerID.North]: undefined,
  [PlayerID.East]: undefined,
  [PlayerID.South]: undefined,
  [PlayerID.West]: undefined,
});
const getDefaultPlayersCardPlayedInPreviousTurn = () => undefined;
const getDefaultPlayersSaid = () => ({
  [PlayerID.North]: [],
  [PlayerID.East]: [],
  [PlayerID.South]: [],
  [PlayerID.West]: [],
});
const getDefaultLastPlayersTakeSaid = () => ({
  [PlayerID.North]: undefined,
  [PlayerID.East]: undefined,
  [PlayerID.South]: undefined,
  [PlayerID.West]: undefined,
});

function getDefaultCurrentResult() {
  return {
    lastTurnCards: getDefaultPlayersCardPlayedInPreviousTurn(),
    lastWinner: undefined,
    points: {
      [TeamID.NorthSouth]: 0,
      [TeamID.EastWest]: 0,
    },
  };
}

export const getSetupGameState = (_: Context<PlayerID, PhaseID>): GameState => {
  const dealer = PlayerID.North;
  const nextDealer = dealer;
  const availableCards = getCards();
  const howManyCardsToDealToEachPlayerBeforeTalking = 8;
  const howManyCardsToDealToEachPlayerAfterTalking = Math.floor(howManyCards / howManyPlayers) - howManyCardsToDealToEachPlayerBeforeTalking;

  return {
    __isWaitingBeforeMovingToNextPhase: false,
    __canMoveToNextPhase: false,
    availableCards,
    playersCards: getDefaultPlayersCards(),
    wonTeamsCards: getDefaultWonTeamsCards(),
    teamsPoints: getDefaultTeamsPoints(),
    dealer,
    nextDealer,
    firstPlayerInCurrentTurn: nextDealer,
    attackingTeam: TeamID.NorthSouth,
    defensingTeam: TeamID.EastWest,
    howManyCardsToDealToEachPlayerBeforeTalking,
    howManyCardsToDealToEachPlayerAfterTalking,
    howManyPointsATeamMustReachToEndTheGame: 2000,
    playersSaid: getDefaultPlayersSaid(),
    lastPlayersTakeSaid: getDefaultLastPlayersTakeSaid(),
    roundResults: getDefaultResults(),
    numberOfSuccessiveSkipSaid: 0,
    currentSayTake: undefined,
    belotAnnounce: undefined,
    resultsConfirmations: getDefaultConfirmationsResult(),
    playersCardPlayedInCurrentTurn: getDefaultPlayersCardPlayedInCurrentTurn(),
    playersCardPlayedInPreviousTurn: getDefaultPlayersCardPlayedInPreviousTurn(),
    currentResult: getDefaultCurrentResult(),
  };
};
const mustMoveFromTalkPhaseToPlayCardsPhase = (currentSayTake: SayTake | undefined, numberOfSuccessiveSkipSaid: number): boolean => {
  return Boolean(
    currentSayTake
    && (
      // 3 successive skips
      numberOfSuccessiveSkipSaid >= (howManyPlayers - 1)
      // surcontre
      || currentSayTake.sayContreLevel === 'surcontre'
      // Capot
      || currentSayTake.expectedPoints === 250
    ),
  );
};
const defaultTurnConfig: TurnConfig<GameState, PlayerID, PhaseID> = {
  order: {
    playOrder: () => getTurnOrder(PlayerID.North),
    first: (G, ctx) => {
      if (ctx.phase === PhaseID.PlayCards) {
        switch (G.firstPlayerInCurrentTurn) {
          case PlayerID.North:
            return 0;
          case PlayerID.West:
            return 1;
          case PlayerID.South:
            return 2;
          case PlayerID.East:
            return 3;
        }
      }

      switch (G.nextDealer) {
        case PlayerID.North:
          return 0;
        case PlayerID.West:
          return 1;
        case PlayerID.South:
          return 2;
        case PlayerID.East:
          return 3;
      }
    },
    next: (G, ctx) => {
      switch (ctx.currentPlayer) {
        case PlayerID.North:
          return 1;
        case PlayerID.West:
          return 2;
        case PlayerID.South:
          return 3;
        case PlayerID.East:
          return 0;
      }
    },
  },
};
export const game: GameConfig<GameState, GameStatePlayerView, Moves, PlayerID, PhaseID> = {
  name: 'contre',
  minPlayers: howManyPlayers,
  maxPlayers: howManyPlayers,

  setup: getSetupGameState,

  turn: defaultTurnConfig,

  events: {
    endStage: false,
    endTurn: false,
    endPhase: false,
    endGame: false,
    setStage: false,
    setPhase: false,
    setActivePlayers: false,
    pass: false,
  },

  phases: {
    [PhaseID.Deal]: {
      start: true,
      onBegin: (G, ctx) => {
        // set new dealer
        const dealer = G.nextDealer;
        const nextDealer = getTurnOrder(dealer)[1];

        // reset round state
        G.playersCards = getDefaultPlayersCards();
        G.wonTeamsCards = getDefaultWonTeamsCards();
        G.playersSaid = getDefaultPlayersSaid();
        G.lastPlayersTakeSaid = getDefaultLastPlayersTakeSaid();
        G.belotAnnounce = undefined;
        G.numberOfSuccessiveSkipSaid = 0;
        G.currentSayTake = undefined;
        G.dealer = dealer;
        G.nextDealer = nextDealer;
        G.firstPlayerInCurrentTurn = nextDealer;
        G.playersCardPlayedInPreviousTurn = getDefaultPlayersCardPlayedInPreviousTurn();
        G.availableCards = ctx.random.Shuffle(getCards());

        // deal cards before talking
        getTurnOrder(nextDealer).forEach(playerID => {
          for (let i = 0; i < G.howManyCardsToDealToEachPlayerBeforeTalking; i++) {
            const card = G.availableCards.pop();
            G.playersCards[playerID].push(card!);
          }
        });

        G.__forcedNextPhase = PhaseID.Talk;
      },
      endIf: (G) => {
        return G.__forcedNextPhase ? { next: G.__forcedNextPhase } : false;
      },
      onEnd: (G) => {
        G.__forcedNextPhase = undefined;
      },
    },
    [PhaseID.Talk]: {
      moves: {
        endTurn,
        waitBeforeMovingToNextPhase,
        moveToNextPhase,
        saySkip,
        sayTake,
        sayContre,
      },
      endIf: (G) => {
        if (G.__canMoveToNextPhase && G.numberOfSuccessiveSkipSaid >= howManyPlayers) {
          return { next: PhaseID.Deal };
        }

        if (G.__canMoveToNextPhase && mustMoveFromTalkPhaseToPlayCardsPhase(G.currentSayTake, G.numberOfSuccessiveSkipSaid)) {
          return { next: PhaseID.PlayCards };
        }

        return false;
      },
      onEnd: (G) => {
        G.__canMoveToNextPhase = false;

        if (
          G.numberOfSuccessiveSkipSaid < howManyPlayers
          && mustMoveFromTalkPhaseToPlayCardsPhase(G.currentSayTake, G.numberOfSuccessiveSkipSaid)
        ) {
          getTurnOrder(G.nextDealer).forEach(playerID => {
            // deal remaining cards
            for (let i = 0; i < G.howManyCardsToDealToEachPlayerAfterTalking; i++) {
              const card = G.availableCards.pop();
              G.playersCards[playerID].push(card!);
            }
          });

          // set belot announce if available
          const belotOwner = getBelotOwner(G.currentSayTake!.trumpMode, G.playersCards);
          if (belotOwner) {
            G.belotAnnounce = {id: 'Belot', owner: belotOwner, ownerHasChosen: false, isSaid: false};
          }
        }
      },
    },
    [PhaseID.PlayCards]: {
      moves: {
        endTurn,
        waitBeforeMovingToNextPhase,
        moveToNextPhase,
        sayBelotOrNot,
        playCard,
      },
      turn: {
        ...defaultTurnConfig,
        onBegin: (G, ctx) => {
          // set players cards playability
          const player = ctx.currentPlayer;
          const playerPartner = getPlayerPartner(player);
          const setCardsPlayability = (cards: Card[], playerIsCurrentPlayer: boolean): Card[] => cards.map(card => ({
            ...card,
            isPlayable: !playerIsCurrentPlayer
              ? false
              : isPlayableCard(
                card,
                G.playersCards[player],
                G.currentSayTake!.trumpMode,
                G.playersCardPlayedInCurrentTurn,
                G.firstPlayerInCurrentTurn,
                playerPartner,
              ),
          }));
          G.playersCards = {
            [PlayerID.North]: setCardsPlayability(G.playersCards[PlayerID.North], PlayerID.North === player),
            [PlayerID.East]: setCardsPlayability(G.playersCards[PlayerID.East], PlayerID.East === player),
            [PlayerID.South]: setCardsPlayability(G.playersCards[PlayerID.South], PlayerID.South === player),
            [PlayerID.West]: setCardsPlayability(G.playersCards[PlayerID.West], PlayerID.West === player),
          };
        },
        onEnd: () => {

        },
      },
      endIf: (G) => {
        if (G.__canMoveToNextPhase && Object.values(G.playersCardPlayedInCurrentTurn).every(card => card !== undefined)) {
          return { next: PhaseID.CountPoints };
        }

        return false;
      },
      onEnd: (G) => {
        G.__canMoveToNextPhase = false;
      },
    },
    [PhaseID.CountPoints]: {
      onBegin: (G, ctx) => {
        if (!G.currentSayTake) {
          throw new Error();
        }

        const playedCards = Object.values(G.playersCardPlayedInCurrentTurn).filter(c => c !== undefined) as Card[];
        const winningCard = getWinningCard(
          playedCards,
          G.currentSayTake.trumpMode,
          G.playersCardPlayedInCurrentTurn[G.firstPlayerInCurrentTurn]!.color,
        );
        const turnWinner = getTurnWinner(G.playersCardPlayedInCurrentTurn, winningCard);
        const turnWinnerTeam = getPlayerTeam(turnWinner);

        // fill cards played in previous turn
        G.playersCardPlayedInPreviousTurn = {...G.playersCardPlayedInCurrentTurn} as Record<PlayerID, Card>; // cast because G.playersCardPlayedInCurrentTurn can't contain "undefined" values at this point

        // move played cards to turnWinner team cards
        playedCards.forEach(card => G.wonTeamsCards[turnWinnerTeam].push(card));
        G.playersCardPlayedInCurrentTurn = getDefaultPlayersCardPlayedInCurrentTurn();

        // turnWinner becomes next first player
        G.firstPlayerInCurrentTurn = turnWinner;

        G.currentResult.lastWinner = turnWinner;
        G.currentResult.lastTurnCards = G.playersCardPlayedInPreviousTurn;
        let points = calculatePoints(
          G.attackingTeam,
          G.wonTeamsCards[G.attackingTeam],
          G.defensingTeam,
          G.wonTeamsCards[G.defensingTeam],
          G.currentSayTake,
          G.belotAnnounce);
        console.log(points);
        [G.currentResult.points[G.attackingTeam], G.currentResult.points[G.defensingTeam]] = points;

        // go to PlayCards phase if not all cards have been played
        if (Object.values(G.wonTeamsCards).reduce((acc, cards) => acc.concat(cards), []).length < howManyCards) {
          G.__forcedNextPhase = PhaseID.PlayCards;
          return;
        }

        G.roundResults = getRoundResults(
          G.teamsPoints[G.attackingTeam],
          G.attackingTeam,
          G.wonTeamsCards[G.attackingTeam],
          G.teamsPoints[G.defensingTeam],
          G.defensingTeam,
          G.wonTeamsCards[G.defensingTeam],
          G.currentSayTake,
          turnWinnerTeam,
          G.belotAnnounce,
        );
        G.currentResult = getDefaultCurrentResult();

        G.teamsPoints[G.attackingTeam] += G.roundResults.TeamsResult[G.attackingTeam].ScoredPoints;
        G.teamsPoints[G.defensingTeam] += G.roundResults.TeamsResult[G.defensingTeam].ScoredPoints;

        // go to Deal phase if the end of the game has not been reached
        const gameWinnerTeam = getGameWinnerTeam(G.teamsPoints, G.howManyPointsATeamMustReachToEndTheGame);
        if (gameWinnerTeam === undefined) {
          G.__forcedNextPhase = PhaseID.Deal;
          return;
        }

        console.log(`The winner is... ${gameWinnerTeam || 'both'}!`, G, ctx);
        ctx.events.endGame();
      },
      endIf: (G) => {
        return G.__forcedNextPhase ? { next: G.__forcedNextPhase } : false;
      },
      onEnd: (G) => {
        G.__forcedNextPhase = undefined;
      },
    },
  },

  playerView: (
    {
      availableCards,
      playersCards,
      ...GWithoutSecretData
    },
    ctx,
    playerID,
  ): GameStatePlayerView => {
    return {
      ...GWithoutSecretData,
      availableCards: new Array(availableCards.length).fill(secretCard),
      playersCards: {
        [PlayerID.North]: PlayerID.North === playerID ? playersCards[playerID] : new Array(playersCards[PlayerID.North].length).fill(secretCard),
        [PlayerID.East]: PlayerID.East === playerID ? playersCards[playerID] : new Array(playersCards[PlayerID.East].length).fill(secretCard),
        [PlayerID.South]: PlayerID.South === playerID ? playersCards[playerID] : new Array(playersCards[PlayerID.South].length).fill(secretCard),
        [PlayerID.West]: PlayerID.West === playerID ? playersCards[playerID] : new Array(playersCards[PlayerID.West].length).fill(secretCard),
      },
      playerCards: playerID ? playersCards[playerID] as Card[] : [],
    };
  },
};
