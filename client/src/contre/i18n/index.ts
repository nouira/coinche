import { TrumpMode, SayTake, ContractResult } from '../../shared/contre';

type TeamType = 'partner' | 'opponent';
export type I18n = {
  teamType: Record<TeamType, string>;
  trumpMode: Record<TrumpMode, string>;
  announce: {
    id: Record<'Belot', string>;
  };
  Score: {
    getTeamName: (teamType: TeamType) => string;
    getSayTake: (sayTake: SayTake | undefined) => string;
    getTakeResult: (resulst: ContractResult | undefined) => string;
    detailTotalPoints: string;
    scoredPoints: string;
    Button: string;
    cardsPoints: string;
    extraPoints: string;
    belotAnnouncePoints: string;
    totalPoints: string;
    roundedTotalPoints: string;
  },
  Info: {
    currentTeamScore: (teamType: TeamType, teamPoints: number, howManyPointsATeamMustReachToEndTheGame: number) => string;
    currentAttackingTeam: (teamType: TeamType) => string;
    currentGoal: (trumpMode: TrumpMode, expectedPoints: number) => string;
    announcesOf: (playerName: string) => string;
  },
  TalkMenu: {
    selectTrumpModePlaceholder: string;
    takeButton: string;
    skipButton: string;
    contreButton: string;
    surcontreButton: string;
  },
  PreviousCardsPlayedMenu: {
    displayPreviousCardsPlayed: string;
    doNotDisplayPreviousCardsPlayed: string;
  },
  PlayerSaid: {
    skip: string;
    contre: string;
    surcontre: string;
  },
  SayAnnounceMenu: {
    noAvailableAnnounce: string;
    sayAnnounceButton: string;
  },
};

export { fr } from './fr';
