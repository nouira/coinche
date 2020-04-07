import {I18n} from './index';
import {TrumpMode, Capot} from '../../shared/contre';

const translatedTrumpMode = {
  [TrumpMode.TrumpSpade]: 'Pique',
  [TrumpMode.TrumpDiamond]: 'Carreau',
  [TrumpMode.TrumpClub]: 'Trèfle',
  [TrumpMode.TrumpHeart]: 'Coeur',
};
const translatedTeamType = {
  partner: 'Nous',
  opponent: 'Eux',
};

export const fr: I18n = {
  teamType: translatedTeamType,
  trumpMode: translatedTrumpMode,
  announce: {
    id: {
      Belot: 'Belote',
    },
  },
  PreviousCardsPlayedMenu: {
    displayPreviousCardsPlayed: 'Voir les cartes jouées au tour précédent',
    doNotDisplayPreviousCardsPlayed: 'Ne plus voir les cartes jouées au tour précédent',
  },
  Score: {
    getTeamName: (teamType) => translatedTeamType[teamType],
    getSayTake: (sayTake) => {
      if(sayTake === undefined)
        return "";
      const contract = `Contrat : ${sayTake.expectedPoints === Capot ? "Capot" : sayTake.expectedPoints} ${translatedTrumpMode[sayTake.trumpMode]}`;
      const contre = `${sayTake.sayContreLevel === undefined ? "" : "Contré"}${sayTake.sayContreLevel === "surcontre" ? "X2" : ""}`;
      return `${contract} ${contre}`;
    },
    getTakeResult: (result) => result === "successed" ? "Réussi" : "Échec",
    detailTotalPoints: "Détail points",
    scoredPoints: "Score",
    cardsPoints: "Cartes",
    extraPoints: "Dernier pli",
    belotAnnouncePoints: "Belote",
    totalPoints: "Total",
    roundedTotalPoints: "Arrondi",
    Button: 'OK'
  },
  Info: {
    currentTeamScore: (teamType, teamPoints, howManyPointsATeamMustReachToEndTheGame) => `${translatedTeamType[teamType]} : ${teamPoints}/${howManyPointsATeamMustReachToEndTheGame}`,
    currentAttackingTeam: (teamType) => `Attaquant : ${translatedTeamType[teamType]}`,
    currentGoal: (trumpMode, expectedPoints) => `Objectif : ${expectedPoints} ${translatedTrumpMode[trumpMode]}`,
    announcesOf: (playerName) => `Annonces de ${playerName} :`,
  },
  TalkMenu: {
    selectTrumpModePlaceholder: `Choisir l'atout…`,
    takeButton: 'Prendre',
    skipButton: 'Passer',
    contreButton: 'Contrer',
    surcontreButton: 'Surcontrer',
  },
  PlayerSaid: {
    skip: 'Je passe',
    contre: 'Je contre',
    surcontre: 'Je surcontre',
  },
  SayAnnounceMenu: {
    noAvailableAnnounce: 'Aucune annonce disponible',
    sayAnnounceButton: 'Annoncer',
  },
};
