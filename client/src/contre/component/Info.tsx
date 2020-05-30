import React, {useContext} from 'react';
import {I18nContext} from '../context/i18n';
import {CurrentResult, PlayerID, TeamID, TrumpMode} from '../../shared/contre';
import {Card as AntCard, Table} from 'antd/lib';
import {PlayedCardsMiniComponent} from './PlayedCards';

type ComponentProps = {
  playerId: PlayerID,
  partnerTeamID: TeamID;
  partnerTeamPoints: number;
  opponentTeamPoints: number;
  howManyPointsATeamMustReachToEndTheGame: number;
  trumpMode?: TrumpMode;
  currentResult: CurrentResult;
};
export const InfoComponent: React.FunctionComponent<ComponentProps> = (
  {
    playerId,
    partnerTeamID,
    partnerTeamPoints,
    opponentTeamPoints,
    howManyPointsATeamMustReachToEndTheGame,
    trumpMode,
    currentResult,
  }) => {
  let opponentTeamID = partnerTeamID == TeamID.EastWest ? TeamID.NorthSouth : TeamID.EastWest;
  const i18n = useContext(I18nContext);
  const columns = [
    {
      title: i18n.Score.getTeamName('partner'),
      dataIndex: 'partner',
      key: 'partner',
    },
    {
      title: i18n.Score.getTeamName('opponent'),
      dataIndex: 'opponent',
      key: 'opponent',
    },
  ];
  let data = [
    {
      key: 'score',
      partner: partnerTeamPoints,
      opponent: opponentTeamPoints,
    },
    {
      key: 'roundScore',
      partner: currentResult?.points[partnerTeamID],
      opponent: currentResult?.points[opponentTeamID],
    },
  ];
  console.log(currentResult?.points[partnerTeamID]);
  console.log(currentResult);
  return (
    <React.Fragment>
      <div className="info">
        <AntCard className="score" size="small" title={howManyPointsATeamMustReachToEndTheGame} >
          <div className='header'>
            <span>{i18n.Score.getTeamName('partner')}</span>
            <span>{i18n.Score.getTeamName('opponent')}</span>
          </div>
          { (currentResult?.points[partnerTeamID] > 0 || currentResult?.points[opponentTeamID] > 0) && (
            <div className='roundPoints'>
              <span>{currentResult?.points[partnerTeamID]}</span>
              <span>{currentResult?.points[opponentTeamID]}</span>
            </div>)}
          <div className='points'>
            <span>{partnerTeamPoints}</span>
            <span>{opponentTeamPoints}</span>
          </div>
        </AntCard>
        <AntCard className="lastRound" size="small">
          <PlayedCardsMiniComponent bottomPlayerID={playerId} trumpMode={trumpMode} playedCards={currentResult.lastTurnCards} winner={currentResult.lastWinner} />
        </AntCard>
      </div>
      {/* <Descriptions title={player} bordered size="small" column={2} layout="vertical">
        {attackingTeamID && trumpMode && expectedPoints && (
          <React.Fragment>
            <Descriptions.Item label={i18n.Info.attackingTeam}>
              {attackingTeamID === partnerTeamID ? i18n.teamType.partner : i18n.teamType.opponent}
            </Descriptions.Item>
            <Descriptions.Item label={i18n.Info.currentGoal}>
              {expectedPoints} <SuitComponent cardColor={getCardColorAssociatedToTrumpMode(trumpMode)} />
            </Descriptions.Item>
          </React.Fragment>
        )}
      </Descriptions> */}
    </React.Fragment>
  );
};
