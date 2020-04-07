import React, {useContext} from 'react';
import { TeamID, RoundResults, TotalPointsDetails, SayTake } from '../../shared/contre';
import {I18nContext} from '../context/i18n';

type PointsDetailComponentProps = {
  pointsDetail: TotalPointsDetails | undefined,
  currentSayTake: SayTake | undefined
}
const PointsDetailDisplay: React.FunctionComponent<PointsDetailComponentProps> = ({
  pointsDetail,
  currentSayTake
}) => {
  const i18n = useContext(I18nContext);

  return (
    <div className="pointsDetail">
      <p className="cardsPoints">{pointsDetail?.CardsPoints}</p>
      <p className="extraPoints">{pointsDetail?.ExtraPoints}</p>
      <p className="belotPoints">{pointsDetail?.BelotAnnouncePoints}</p>
      <p className="totalPoints">{pointsDetail?.TotalPoints}</p>
      <p className="roundedPoints">{pointsDetail?.RoundedTotalPoints}</p>
    </div>
  );
};

type ComponentProps = {
  partnerTeamID : TeamID,
  opponentTeamID : TeamID,
  roundScore: RoundResults | undefined,
  endAck: () => void,
  currentSayTake: SayTake | undefined
};

export const RoundScore: React.FunctionComponent<ComponentProps> = ({
  roundScore,
  partnerTeamID,
  opponentTeamID,
  endAck,
  currentSayTake
}) => {
  const i18n = useContext(I18nContext);

  return (
    <div className="roundScore">
      <p className="contract">{i18n.Score.getSayTake(currentSayTake)}</p>
      <p className="contractResult">{i18n.Score.getTakeResult(roundScore?.ContractResult)}</p>
      <p className="header totalPoints">{i18n.Score.detailTotalPoints}</p>
      <p className="header scoredPoints">{i18n.Score.scoredPoints}</p>
      <p className="header partnerTeam">{i18n.Score.getTeamName('partner')}</p>
      <p className="header opponentTeam">{i18n.Score.getTeamName('opponent')}</p>

      <p className="detailedTotalPoints cardsPoints">{i18n.Score.cardsPoints}</p>
      <p className="detailedTotalPoints extraPoints">{i18n.Score.extraPoints}</p>
      <p className="detailedTotalPoints belotPoints">{i18n.Score.belotAnnouncePoints}</p>
      <p className="detailedTotalPoints totalPoints">{i18n.Score.totalPoints}</p>
      <p className="detailedTotalPoints roundedPoints">{i18n.Score.roundedTotalPoints}</p>

      <p className="partnerTeam cardsPoints">{roundScore?.TeamsResult[partnerTeamID].PointsDetail?.CardsPoints}</p>
      <p className="partnerTeam extraPoints">{roundScore?.TeamsResult[partnerTeamID].PointsDetail?.ExtraPoints}</p>
      <p className="partnerTeam belotPoints">{roundScore?.TeamsResult[partnerTeamID].PointsDetail?.BelotAnnouncePoints}</p>
      <p className="partnerTeam totalPoints">{roundScore?.TeamsResult[partnerTeamID].PointsDetail?.TotalPoints}</p>
      <p className="partnerTeam roundedPoints">{roundScore?.TeamsResult[partnerTeamID].PointsDetail?.RoundedTotalPoints}</p>

      <p className="partnerTeam scoredPoints">{roundScore?.TeamsResult[partnerTeamID].ScoredPoints}</p>

      <p className="opponentTeam cardsPoints">{roundScore?.TeamsResult[opponentTeamID].PointsDetail?.CardsPoints}</p>
      <p className="opponentTeam extraPoints">{roundScore?.TeamsResult[opponentTeamID].PointsDetail?.ExtraPoints}</p>
      <p className="opponentTeam belotPoints">{roundScore?.TeamsResult[opponentTeamID].PointsDetail?.BelotAnnouncePoints}</p>
      <p className="opponentTeam totalPoints">{roundScore?.TeamsResult[opponentTeamID].PointsDetail?.TotalPoints}</p>
      <p className="opponentTeam roundedPoints">{roundScore?.TeamsResult[opponentTeamID].PointsDetail?.RoundedTotalPoints}</p>

      <p className="opponentTeam scoredPoints">{roundScore?.TeamsResult[opponentTeamID].ScoredPoints}</p>
      <div className="footer">
        <button onClick={() => endAck()}>{i18n.Score.Button}</button>
      </div>
    </div>
  );
};
