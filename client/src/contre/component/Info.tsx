import React, {useContext} from 'react';
import {I18nContext} from '../context/i18n';
import {BelotAnnounce, ExpectedPoints, PlayerID, TeamID, TrumpMode, getCardColorAssociatedToTrumpMode} from '../../shared/contre';
import { SuitComponent } from './Card';
import { Descriptions, Statistic } from 'antd/lib';

type ComponentProps = {
  player: string,
  partnerTeamID: TeamID;
  partnerTeamPoints: number;
  opponentTeamPoints: number;
  howManyPointsATeamMustReachToEndTheGame: number;
  attackingTeamID?: TeamID;
  trumpMode?: TrumpMode;
  expectedPoints?: ExpectedPoints;
  displayablePlayersAnnounces: Record<PlayerID, { playerName: string; announces: (BelotAnnounce)[] }>;
};
export const InfoComponent: React.FunctionComponent<ComponentProps> = ({
  player,
  partnerTeamID,
  partnerTeamPoints,
  opponentTeamPoints,
  howManyPointsATeamMustReachToEndTheGame,
  attackingTeamID,
  trumpMode,
  expectedPoints,
  displayablePlayersAnnounces,
}) => {
  const i18n = useContext(I18nContext);

  return (
    <React.Fragment>
      <Descriptions title={player} bordered size="small" column={2} layout="vertical">
        <Descriptions.Item label={i18n.teamType.partner} >
          <Statistic value={partnerTeamPoints} suffix={`/ ${howManyPointsATeamMustReachToEndTheGame}`} />
        </Descriptions.Item>
        <Descriptions.Item label={i18n.teamType.opponent}>
          <Statistic value={opponentTeamPoints} suffix={`/ ${howManyPointsATeamMustReachToEndTheGame}`} />
        </Descriptions.Item>
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
        {Object.entries(displayablePlayersAnnounces)
          .filter(([_, { announces }]) => announces.length > 0)
          .map(([playerID, { playerName, announces }]) => (
            <Descriptions.Item key={playerID} label={i18n.Info.announcesOf(playerName)}>
              {announces.map(a => (
                <div key={a.id}>{`- ${i18n.announce.id[a.id]}`}</div>
              ))}
            </Descriptions.Item>
          ))
        }
      </Descriptions>

    </React.Fragment>
  );
};
