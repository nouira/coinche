import React, {useContext} from 'react';
import { TeamID, RoundResults, TotalPointsDetails, SayTake } from '../../shared/contre';
import {I18nContext} from '../context/i18n';
import { Table, Descriptions, Button, Typography } from 'antd/lib';

const { Text } = Typography;

type PointsDetailComponentProps = {
  pointsDetail: TotalPointsDetails | undefined,
  currentSayTake: SayTake | undefined
}
const PointsDetailDisplay: React.FunctionComponent<PointsDetailComponentProps> = ({
  pointsDetail,
  currentSayTake,
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
  currentSayTake: SayTake | undefined
};

export const RoundScore: React.FunctionComponent<ComponentProps> = ({
  roundScore,
  partnerTeamID,
  opponentTeamID,
  currentSayTake,
}) => {
  const i18n = useContext(I18nContext);

  const columns = [
    {
      title: '',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (<th>{text}</th>),
    },
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
  const data = [
    {
      key: 'CardsPoints',
      description: i18n.Score.cardsPoints,
      partner: roundScore?.TeamsResult[partnerTeamID].PointsDetail?.CardsPoints,
      opponent: roundScore?.TeamsResult[opponentTeamID].PointsDetail?.CardsPoints,
    },
    {
      key: 'ExtraPoints',
      description: i18n.Score.extraPoints,
      partner: roundScore?.TeamsResult[partnerTeamID].PointsDetail?.ExtraPoints,
      opponent: roundScore?.TeamsResult[opponentTeamID].PointsDetail?.ExtraPoints,
    },
    {
      key: 'BelotAnnouncePoints',
      description: i18n.Score.belotAnnouncePoints,
      partner: roundScore?.TeamsResult[partnerTeamID].PointsDetail?.BelotAnnouncePoints,
      opponent: roundScore?.TeamsResult[opponentTeamID].PointsDetail?.BelotAnnouncePoints,
    },
    {
      key: 'TotalPoints',
      description: i18n.Score.totalPoints,
      partner: roundScore?.TeamsResult[partnerTeamID].PointsDetail?.TotalPoints,
      opponent: roundScore?.TeamsResult[opponentTeamID].PointsDetail?.TotalPoints,
    },
    {
      key: 'RoundedTotalPoints',
      description: i18n.Score.roundedTotalPoints,
      partner: roundScore?.TeamsResult[partnerTeamID].PointsDetail?.RoundedTotalPoints,
      opponent: roundScore?.TeamsResult[opponentTeamID].PointsDetail?.RoundedTotalPoints,
    },
  ];

  return (
    <div className="roundScore">
      <Descriptions bordered size="small"
        column={{ sm: 3, xs: 1 }}>
        <Descriptions.Item label={i18n.Score.contract} span={2}>{i18n.Score.getSayTake(currentSayTake)}</Descriptions.Item>
        <Descriptions.Item label={i18n.Score.result}>{i18n.Score.getTakeResult(roundScore?.ContractResult)}</Descriptions.Item>
        <Descriptions.Item label={i18n.Score.detailTotalPoints}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            summary={() => {
              return (
                <>
                  <tr>
                    <th>{i18n.Score.scoredPoints}</th>
                    <td>
                      <Text>{roundScore?.TeamsResult[partnerTeamID].ScoredPoints}</Text>
                    </td>
                    <td>
                      <Text>{roundScore?.TeamsResult[opponentTeamID].ScoredPoints}</Text>
                    </td>
                  </tr>
                </>
              );
            }}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
