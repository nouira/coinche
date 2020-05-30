import {
  BelotAnnounce,
  Capot,
  Card,
  CardName,
  ContractResult,
  ContreScoredPoints,
  getPlayerTeam,
  getTrumpModeAssociatedToCardColor,
  RoundResults,
  SayTake,
  TeamID,
  TotalPointsDetails,
  TrumpMode,
} from '../index';

const getPointsForExpectedPoints = (currentSayTake: SayTake): number => {
  const trumpModePoints = currentSayTake.expectedPoints;

  return currentSayTake.sayContreLevel ? (currentSayTake.sayContreLevel === 'surcontre' ? trumpModePoints * 4 : trumpModePoints * 2) : trumpModePoints;
};

export const getPointsForCard = (card: Card, trumpMode: TrumpMode): number => {
  switch (card.name) {
    case CardName.Ace:
      return 11;
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

const getExpectedPointsValue = (currentSayTake: SayTake): number => {
  const trumpModePoints = currentSayTake.expectedPoints;

  return currentSayTake.sayContreLevel ? (currentSayTake.sayContreLevel === 'surcontre' ? trumpModePoints * 4 : trumpModePoints * 2) : trumpModePoints;
};
const getTotalPoint = (detailPoints: TotalPointsDetails) =>
  detailPoints.CardsPoints + detailPoints.ExtraPoints + detailPoints.BelotAnnouncePoints;

export const calculatePoints = (
  attackingTeam: TeamID,
  attackingTeamWonCards: Card[],
  defensingTeam: TeamID,
  defensingTeamWonCards: Card[],
  roundSayTake: SayTake,
  belotAnnounce: BelotAnnounce | undefined,
) : [number, number] => {
  let attackingTeamCardsPoints = attackingTeamWonCards.reduce((acc, card) => acc + getPointsForCard(card, roundSayTake.trumpMode), 0);
  let defensingTeamCardsPoints = defensingTeamWonCards.reduce((acc, card) => acc + getPointsForCard(card, roundSayTake.trumpMode), 0);

  // compute belot announce points
  let attackingTeamBelotAnnouncePoints = (belotAnnounce && belotAnnounce.isSaid && getPlayerTeam(belotAnnounce.owner) === attackingTeam) ? 20 : 0;
  let defensingTeamBelotAnnouncePoints = (belotAnnounce && belotAnnounce.isSaid && getPlayerTeam(belotAnnounce.owner) === defensingTeam) ? 20 : 0;

  return [
    attackingTeamCardsPoints + attackingTeamBelotAnnouncePoints,
    defensingTeamCardsPoints + defensingTeamBelotAnnouncePoints,
  ];
};

export const getRoundResults = (
  currentAttackingTeamPoints: number,
  attackingTeam: TeamID,
  attackingTeamWonCards: Card[],
  currentDefensingTeamPoints: number,
  defensingTeam: TeamID,
  defensingTeamWonCards: Card[],
  roundSayTake: SayTake,
  lastTurnWinnerTeam: TeamID,
  belotAnnounce: BelotAnnounce | undefined,
): RoundResults => {
  // compute Talk phase points
  const talkPhasePoints = getExpectedPointsValue(roundSayTake);

  const isCapot = !defensingTeamWonCards.length || !attackingTeamWonCards.length;
  let attackingTeamPointsDetails : TotalPointsDetails = {
    ExtraPoints: 0,
    CardsPoints: 0,
    BelotAnnouncePoints: 0,
    TotalPoints: 0,
    RoundedTotalPoints: 0,
    ScoredPoints: 0,
  };
  let defensingTeamPointsDetails : TotalPointsDetails = {
    ExtraPoints: 0,
    CardsPoints: 0,
    BelotAnnouncePoints: 0,
    TotalPoints: 0,
    RoundedTotalPoints: 0,
    ScoredPoints: 0,
  };

  // last turn (10) extra points
  attackingTeamPointsDetails.ExtraPoints = attackingTeam === lastTurnWinnerTeam  ? 10 : 0;
  defensingTeamPointsDetails.ExtraPoints = defensingTeam === lastTurnWinnerTeam  ? 10 : 0;

  // compute cards points
  attackingTeamPointsDetails.CardsPoints = attackingTeamWonCards.reduce((acc, card) => acc + getPointsForCard(card, roundSayTake.trumpMode), 0);
  defensingTeamPointsDetails.CardsPoints = defensingTeamWonCards.reduce((acc, card) => acc + getPointsForCard(card, roundSayTake.trumpMode), 0);

  // compute belot announce points
  attackingTeamPointsDetails.BelotAnnouncePoints = (belotAnnounce && belotAnnounce.isSaid && getPlayerTeam(belotAnnounce.owner) === attackingTeam) ? 20 : 0;
  defensingTeamPointsDetails.BelotAnnouncePoints = (belotAnnounce && belotAnnounce.isSaid && getPlayerTeam(belotAnnounce.owner) === defensingTeam) ? 20 : 0;
  const belotAnnouncePoints = (belotAnnounce && belotAnnounce.isSaid) ? 20 : 0;

  // check which team won the round then assign their points accordingly
  let attackingTeamTotalPoints = getTotalPoint(attackingTeamPointsDetails);
  let defensingTeamTotalPoints = getTotalPoint(defensingTeamPointsDetails);

  const attackingTeamTotalPointsRest = attackingTeamTotalPoints % 10;
  const attackingTeamTotalPointsFloor = Math.floor(attackingTeamTotalPoints / 10) + (attackingTeamTotalPointsRest >= 5 ? 1 : 0);
  attackingTeamPointsDetails.RoundedTotalPoints = attackingTeamTotalPointsFloor * 10;

  const defensingTeamTotalPointsRest = defensingTeamTotalPoints % 10;
  const defensingTeamTotalPointsFloor = Math.floor(defensingTeamTotalPoints / 10) + (defensingTeamTotalPointsRest >= 5 ? 1 : 0);
  defensingTeamPointsDetails.RoundedTotalPoints = defensingTeamTotalPointsFloor * 10;

  let contractResult : ContractResult;
  if(isCapot)
  {
    let scoredPoint = (talkPhasePoints === Capot) ? Capot * 2 : Capot;

    if(attackingTeam === lastTurnWinnerTeam) {
      attackingTeamPointsDetails.ScoredPoints = scoredPoint;
      contractResult = 'succeeded';
    }
    else {
      defensingTeamPointsDetails.ScoredPoints = scoredPoint;
      contractResult = 'failed';
    }
  }
  else {
    let contreScoredPoint = (roundSayTake.sayContreLevel === 'contre' ? ContreScoredPoints : ContreScoredPoints * 2) + belotAnnouncePoints;
    if (attackingTeamPointsDetails.RoundedTotalPoints >= roundSayTake.expectedPoints &&
      attackingTeamPointsDetails.RoundedTotalPoints >= defensingTeamPointsDetails.RoundedTotalPoints) {
      contractResult = 'succeeded';
      if(roundSayTake.sayContreLevel === undefined) {
        attackingTeamPointsDetails.ScoredPoints = attackingTeamPointsDetails.RoundedTotalPoints;
        defensingTeamPointsDetails.ScoredPoints = defensingTeamPointsDetails.RoundedTotalPoints;
      }
      else {
        attackingTeamPointsDetails.ScoredPoints = contreScoredPoint;
      }
    }
    else {
      contractResult = 'failed';
      defensingTeamPointsDetails.ScoredPoints =  (roundSayTake.sayContreLevel === undefined) ?
        attackingTeamPointsDetails.TotalPoints + defensingTeamPointsDetails.TotalPoints :
        contreScoredPoint;
    }
  }
  return {
    ContractResult: contractResult,
    TeamsResult: {
      [TeamID.NorthSouth]: attackingTeam === TeamID.NorthSouth ? attackingTeamPointsDetails : defensingTeamPointsDetails,
      [TeamID.EastWest]: attackingTeam === TeamID.EastWest ? attackingTeamPointsDetails : defensingTeamPointsDetails,
    },
  };
};
