import './Client.css';
import React, {useContext, useState} from 'react';
import {BoardProps} from 'boardgame.io/react';
import {
  BelotAnnounce,
  Capot,
  Card,
  ExpectedPoints,
  GameStatePlayerView,
  getBelotCards,
  getCardColorAssociatedToTrumpMode,
  getPlayerPartner,
  getPlayerTeam,
  howManyPlayers,
  isSameCard,
  isSayableExpectedPoints,
  Moves,
  PhaseID,
  PlayerID,
  TeamID,
  TrumpMode,
  validExpectedPoints,
} from '../shared/contre';
import {getPlayerIDForPosition, PlayerScreenPosition} from './service/getPlayerIDForPosition';
import {getPlayerNameByID} from './service/getPlayerNameByID';
import {TalkMenuComponent} from './component/TalkMenu';
import {MyCardsComponent} from './component/MyCards';
import {OtherPlayerCardsComponent} from './component/OtherPlayerCards';
import {PlayerSaidComponent} from './component/PlayerSaid';
import {PreviousCardsPlayedMenuComponent} from './component/PreviousCardsPlayedMenu';
import {PlayedCardsComponent} from './component/PlayedCards';
import {RoundScore} from './component/RoundScore';
import {InfoComponent} from './component/Info';
import {HiddenStackedCardsComponent} from './component/HiddenStackedCards';

import {Avatar, Badge, Col, Drawer, Layout, Row, Typography} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {SuitComponent} from './component/Card';
import {I18nContext} from './context/i18n';

const { Header, Content, Footer, Sider } = Layout;
const { Title  } = Typography;

const getTurnIndicatorForPosition = (
  position: PlayerScreenPosition,
  currentPhaseNeedsToWaitForAPlayerMove: boolean,
  currentPlayerIsTopPlayer: boolean,
  currentPlayerIsLeftPlayer: boolean,
  currentPlayerIsRightPlayer: boolean,
  currentPlayerIsBottomPlayer: boolean,
): boolean => {
  if (!currentPhaseNeedsToWaitForAPlayerMove) {
    return false;
  }

  if ((currentPlayerIsTopPlayer && position === 'top')
    || (currentPlayerIsLeftPlayer && position === 'left')
    || (currentPlayerIsRightPlayer && position === 'right')
    || (currentPlayerIsBottomPlayer && position === 'bottom')) {
    return true;
  }

  return false;
};

export const BoardComponent: React.FunctionComponent<BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>> = ({
  G,
  ctx,
  moves,
  playerID,
  gameMetadata,
}) => {
  const i18n = useContext(I18nContext);
  const bottomPlayerID = playerID !== null ? playerID : PlayerID.South;
  const topPlayerID = getPlayerIDForPosition(bottomPlayerID, 'top');
  const leftPlayerID = getPlayerIDForPosition(bottomPlayerID, 'left');
  const rightPlayerID = getPlayerIDForPosition(bottomPlayerID, 'right');

  const partnerTeamID = getPlayerTeam(bottomPlayerID);
  const opponentTeamID = partnerTeamID === TeamID.NorthSouth ? TeamID.EastWest : TeamID.NorthSouth;

  const currentPlayerIsBottomPlayer = bottomPlayerID === ctx.currentPlayer;
  const currentPlayerIsTopPlayer = topPlayerID === ctx.currentPlayer;
  const currentPlayerIsLeftPlayer = leftPlayerID === ctx.currentPlayer;
  const currentPlayerIsRightPlayer = rightPlayerID === ctx.currentPlayer;

  const currentPhaseIsTalk = ctx.phase === PhaseID.Talk;
  const currentPhaseIsPlayCards = ctx.phase === PhaseID.PlayCards;
  const currentPhaseNeedsToWaitForAPlayerMove = currentPhaseIsTalk || currentPhaseIsPlayCards;

  const [lastRoundResultVisible, setlastRoundResultVisible] = useState(false);
  const modalTarget = React.createRef<HTMLDivElement>();

  const isNotFirstPlayCardTurn = G.playersCardPlayedInPreviousTurn !== undefined;

  const [isDisplayedPreviousCardsPlayed, setIsDisplayedPreviousCardsPlayed] = useState(false);
  const playedCards = isDisplayedPreviousCardsPlayed ? G.playersCardPlayedInPreviousTurn : G.playersCardPlayedInCurrentTurn;

  const lastTeamTakeSaid = G.lastPlayersTakeSaid[bottomPlayerID] ?? G.lastPlayersTakeSaid[topPlayerID];

  const belotCards = G.currentSayTake ? getBelotCards(G.currentSayTake.trumpMode) : [];
  const displayableAnnouncesByPlayerID: Record<PlayerID, { playerName: string; announces: (BelotAnnounce)[] }> = {
    [PlayerID.North]: {
      playerName: getPlayerNameByID(gameMetadata, PlayerID.North),
      announces: [],
    },
    [PlayerID.East]: {
      playerName: getPlayerNameByID(gameMetadata, PlayerID.East),
      announces: [],
    },
    [PlayerID.South]: {
      playerName: getPlayerNameByID(gameMetadata, PlayerID.South),
      announces: [],
    },
    [PlayerID.West]: {
      playerName: getPlayerNameByID(gameMetadata, PlayerID.West),
      announces: [],
    },
  };
  if (G.belotAnnounce && G.belotAnnounce.isSaid) {
    displayableAnnouncesByPlayerID[G.belotAnnounce.owner].announces.push(G.belotAnnounce);
  }

  const sayTake = (selectedExpectedPoint: ExpectedPoints | undefined, selectedTrumpMode: TrumpMode | undefined) => {
    if(selectedExpectedPoint !== undefined && selectedTrumpMode !== undefined)
    {
      moves.sayTake(selectedExpectedPoint, selectedTrumpMode);
      if (selectedExpectedPoint === Capot) {
        moves.waitBeforeMovingToNextPhase();
        setTimeout(() => {
          moves.moveToNextPhase();
        }, 1000);
      } else {
        moves.endTurn();
      }
    }
  };
  const sayContre = () => {
    const isCurrentSayTakeContredBeforeSayingContre = Boolean(G.currentSayTake && G.currentSayTake.sayContreLevel === 'contre');
    moves.sayContre();

    if (isCurrentSayTakeContredBeforeSayingContre) {
      moves.waitBeforeMovingToNextPhase();
      setTimeout(() => {
        moves.moveToNextPhase();
      }, 1000);
    } else {
      moves.endTurn();
    }
  };
  const saySkip = () => {
    const numberOfSuccessiveSkipSaidBeforeSayingThisSkip = G.numberOfSuccessiveSkipSaid;
    moves.saySkip();

    if (
      numberOfSuccessiveSkipSaidBeforeSayingThisSkip >= (howManyPlayers - 1)
      || (G.currentSayTake && numberOfSuccessiveSkipSaidBeforeSayingThisSkip >= (howManyPlayers - 2))
    ) {
      moves.waitBeforeMovingToNextPhase();
      setTimeout(() => {
        moves.moveToNextPhase();
      }, 1000);
    } else {
      moves.endTurn();
    }
  };
  const playCard = (card: Card) => {
    const numberOfCardsPlayedBeforePlayingThisCard = Object.values(G.playersCardPlayedInCurrentTurn).filter(card => card !== undefined).length;
    moves.playCard(card);

    if (numberOfCardsPlayedBeforePlayingThisCard >= (howManyPlayers - 1)) {
      moves.waitBeforeMovingToNextPhase();
      setTimeout(() => {
        moves.moveToNextPhase();
      }, 2000);
    } else {
      moves.endTurn();
    }
  };

  const playerArea = (playerId: PlayerID, teamId: TeamID, screenPosition: PlayerScreenPosition, showWonStack: boolean) => {
    let style = getTurnIndicatorForPosition(screenPosition, currentPhaseNeedsToWaitForAPlayerMove,
      currentPlayerIsTopPlayer, currentPlayerIsLeftPlayer, currentPlayerIsRightPlayer, currentPlayerIsBottomPlayer) ?
      {background: '#016f94', color:'#fff', borderColor:'lightblue'} : {};

    return (
      <div className={`otherPlayer player ${screenPosition}`}>
        <OtherPlayerCardsComponent cards={G.playersCards[playerId]} />
        {playerHolder(playerId, screenPosition)}
        {/* <div className="additionalCards">
          {currentPhaseIsTalk && G.dealer === playerId && (
            <HiddenStackedCardsComponent cards={G.availableCards} />
          )}
          {currentPhaseIsPlayCards && showWonStack && (
            <HiddenStackedCardsComponent cards={G.wonTeamsCards[teamId]} />
          )}
        </div> */}
      </div>
    );
  };

  const playerHolder = (playerId: PlayerID, screenPosition: PlayerScreenPosition) => {
    let style = getTurnIndicatorForPosition(screenPosition, currentPhaseNeedsToWaitForAPlayerMove,
      currentPlayerIsTopPlayer, currentPlayerIsLeftPlayer, currentPlayerIsRightPlayer, currentPlayerIsBottomPlayer) ?
      {background: '#016f94', color:'#fff', borderColor:'lightblue'} : {};
    let classExceptedPoint = G.currentSayTake?.sayContreLevel === undefined ? '': G.currentSayTake?.sayContreLevel;
    return (<div className="playerHolder">
      <Badge count={G.firstPlayerInCurrentTurn === playerId ? 1 : null} >
        <Avatar shape="square" size="large" icon={<UserOutlined />} />
      </Badge>
      <div className='playerDetail'>
        <div className="playerName" style={style}>{getPlayerNameByID(gameMetadata, playerId)}</div>
        {G.currentSayTake?.playerID === playerId && ctx.phase === PhaseID.PlayCards && (
          <div className='playerTake'>
            <span className={classExceptedPoint}>{G.currentSayTake.expectedPoints}</span>
            <SuitComponent cardColor={getCardColorAssociatedToTrumpMode(G.currentSayTake.trumpMode)} size='small' />
            {G.currentSayTake.sayContreLevel === 'contre' && (
              <span>C</span>
            )}
            {G.currentSayTake.sayContreLevel === 'surcontre' && (
              <span>SC</span>
            )}
          </div>
        )}
      </div>
      {currentPhaseIsTalk && (!currentPlayerIsTopPlayer || G.__isWaitingBeforeMovingToNextPhase) && G.playersSaid[playerId] && (
        <PlayerSaidComponent playerSaid={G.playersSaid[playerId]} playerScreenPosition={screenPosition}/>
      )}
    </div>);
  };

  return (
    <Layout>
      <Header style={{backgroundColor:'#fff', verticalAlign:'middle', padding:'5px 50px'}}>
        <Title>Belote</Title>
      </Header>
      <Layout>
        {/* <Sider collapsible defaultCollapsed={true} theme="light">
          <Button style={{zIndex:2000}} onClick={() => setlastRoundResultVisible(true)}>History</Button>
          <InfoComponent
            player={getPlayerNameByID(gameMetadata, bottomPlayerID)}
            partnerTeamID={partnerTeamID}
            partnerTeamPoints={G.teamsPoints[partnerTeamID]}
            opponentTeamPoints={G.teamsPoints[opponentTeamID]}
            howManyPointsATeamMustReachToEndTheGame={G.howManyPointsATeamMustReachToEndTheGame}
            attackingTeamID={G.currentSayTake && G.attackingTeam}
            trumpMode={G.currentSayTake?.trumpMode}
            expectedPoints={G.currentSayTake?.expectedPoints}
            displayablePlayersAnnounces={displayableAnnouncesByPlayerID}
          />
        </Sider> */}
        <Content>
          <div className="board" ref={modalTarget}>
            <InfoComponent
              playerId={bottomPlayerID}
              partnerTeamID={partnerTeamID}
              partnerTeamPoints={G.teamsPoints[partnerTeamID]}
              opponentTeamPoints={G.teamsPoints[opponentTeamID]}
              howManyPointsATeamMustReachToEndTheGame={G.howManyPointsATeamMustReachToEndTheGame}
              trumpMode={G.currentSayTake?.trumpMode}
              currentResult={G.currentResult}
            />
            <Drawer
              title="Results"
              placement="left"
              closable={false}
              width={600}
              zIndex={2001}
              onClose={() => setlastRoundResultVisible(false)}
              visible={lastRoundResultVisible}>
              <RoundScore partnerTeamID={partnerTeamID} opponentTeamID={opponentTeamID} roundScore={G.roundResults}
                currentSayTake={G.currentSayTake} />
            </Drawer>
            {!G.__isWaitingBeforeMovingToNextPhase && !isDisplayedPreviousCardsPlayed && currentPhaseIsTalk && currentPlayerIsBottomPlayer && (
              <TalkMenuComponent
                saySkip={saySkip}
                canSayTake={!(G.currentSayTake && G.currentSayTake.sayContreLevel === 'contre')}
                sayTake={sayTake}
                sayContre={sayContre}
                visible={!G.__isWaitingBeforeMovingToNextPhase && !isDisplayedPreviousCardsPlayed && currentPhaseIsTalk && currentPlayerIsBottomPlayer}
                canSayContre={Boolean(G.currentSayTake && G.attackingTeam === opponentTeamID && G.currentSayTake.sayContreLevel !== 'contre')}
                canSaySurcontre={Boolean(G.currentSayTake && G.attackingTeam === partnerTeamID && G.currentSayTake.sayContreLevel === 'contre')}
                selectedTrumpModeDefaultValue={lastTeamTakeSaid ? lastTeamTakeSaid.trumpMode : undefined}
                sayableExpectedPoints={validExpectedPoints.filter(expectedPoint => isSayableExpectedPoints(expectedPoint, G.currentSayTake?.expectedPoints))}
              />)
            }
            <Row>
              <Col span={15} offset={5}>
                {playerArea(topPlayerID, partnerTeamID, 'top', true)}
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                {playerArea(leftPlayerID, opponentTeamID, 'left', true)}
              </Col>
              <Col span={10}>
                <PlayedCardsComponent bottomPlayerID={bottomPlayerID} playedCards={playedCards} trumpMode={G.currentSayTake?.trumpMode} />
              </Col>
              <Col span={7}>
                {playerArea(rightPlayerID, opponentTeamID, 'right', false)}
              </Col>
            </Row>
            <Row className='bottom'>
              <Col span={24}>
                <div className="myPlayer player bottom">
                  {playerHolder(bottomPlayerID, 'bottom')}
                  {!isDisplayedPreviousCardsPlayed && (
                    <MyCardsComponent
                      cards={G.playerCards}
                      isMyTurnToPlayACard={!G.__isWaitingBeforeMovingToNextPhase && currentPhaseIsPlayCards && currentPlayerIsBottomPlayer}
                      playCard={playCard}
                      trumpMode={G.currentSayTake?.trumpMode}
                      playersCardPlayedInCurrentTurn={G.playersCardPlayedInCurrentTurn}
                      firstPlayerInCurrentTurn={G.firstPlayerInCurrentTurn}
                      playerPartner={getPlayerPartner(bottomPlayerID)}
                      sayBelotOrNot={moves.sayBelotOrNot}
                      belotCards={(belotCards.length && belotCards.every(bc => G.playerCards.some(pc => isSameCard(bc, pc)))) ? belotCards : []}
                    />
                  )}
                  <div className="additionalCards">
                    {!isDisplayedPreviousCardsPlayed && currentPhaseIsTalk && G.dealer === bottomPlayerID && (
                      <HiddenStackedCardsComponent cards={G.availableCards} />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
