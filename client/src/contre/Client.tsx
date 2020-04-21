import './Client.css';
import React, {useState} from 'react';
import {BoardProps} from 'boardgame.io/react';
import {
  BelotAnnounce,
  Card,
  ExpectedPoints,
  GameStatePlayerView,
  Moves,
  PhaseID,
  PlayerID,
  PlayerAnnounce,
  SecretPlayerAnnounce,
  TeamID,
  TrumpMode,
  getBelotCards,
  getPlayerPartner,
  getPlayerTeam,
  isSameCard,
  isSayableExpectedPoints,
  howManyPlayers,
  validExpectedPoints,
  Capot,
} from '../shared/contre';
import {PlayerScreenPosition, getPlayerIDForPosition} from './service/getPlayerIDForPosition';
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

import { Row, Col, Button, Card as CardContainer, Affix } from 'antd';

const getTurnIndicatorClassForPosition = (
  position: PlayerScreenPosition,
  currentPhaseNeedsToWaitForAPlayerMove: boolean,
  currentPlayerIsTopPlayer: boolean,
  currentPlayerIsLeftPlayer: boolean,
  currentPlayerIsRightPlayer: boolean,
  currentPlayerIsBottomPlayer: boolean,
): string => {
  if (!currentPhaseNeedsToWaitForAPlayerMove) {
    return '';
  }

  if ((currentPlayerIsTopPlayer && position === 'top')
    || (currentPlayerIsLeftPlayer && position === 'left')
    || (currentPlayerIsRightPlayer && position === 'right')
    || (currentPlayerIsBottomPlayer && position === 'bottom')) {
    return 'currentPlayer';
  }

  return '';
};

export const BoardComponent: React.FunctionComponent<BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>> = ({
  G,
  ctx,
  moves,
  playerID,
  gameMetadata,
}) => {
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
  const currentPhaseIsDisplayResults = ctx.phase === PhaseID.DisplayResults;
  const currentPhaseNeedsToWaitForAPlayerMove = currentPhaseIsTalk || currentPhaseIsPlayCards;

  const isNotFirstPlayCardTurn = G.playersCardPlayedInPreviousTurn !== undefined;

  const [isDisplayedPreviousCardsPlayed, setIsDisplayedPreviousCardsPlayed] = useState(false);
  const playedCards = isDisplayedPreviousCardsPlayed ? G.playersCardPlayedInPreviousTurn : G.playersCardPlayedInCurrentTurn;

  const lastBottomPlayerTakeSaid = G.lastPlayersTakeSaid[bottomPlayerID];

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

  const sayTake = (selectedExpectedPoint: ExpectedPoints, selectedTrumpMode: TrumpMode) => {
    moves.sayTake(selectedExpectedPoint, selectedTrumpMode);
    if (selectedExpectedPoint === Capot) {
      moves.waitBeforeMovingToNextPhase();
      setTimeout(() => {
        moves.moveToNextPhase();
      }, 1000);
    } else {
      moves.endTurn();
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

  const playerArea = (playerId: PlayerID, teamId: TeamID, screenPosition: PlayerScreenPosition, showWonStack: boolean) => (
    <div className={`otherPlayer player ${screenPosition} ${getTurnIndicatorClassForPosition(screenPosition, currentPhaseNeedsToWaitForAPlayerMove, currentPlayerIsTopPlayer, currentPlayerIsLeftPlayer, currentPlayerIsRightPlayer, currentPlayerIsBottomPlayer)}`}>
      <OtherPlayerCardsComponent cards={G.playersCards[playerId]} />
      <div className="additionalCards">
        {currentPhaseIsTalk && G.dealer === playerId && (
          <HiddenStackedCardsComponent cards={G.availableCards} />
        )}
        {currentPhaseIsPlayCards && showWonStack && (
          <HiddenStackedCardsComponent cards={G.wonTeamsCards[teamId]} />
        )}
      </div>
      <div className="playerName">{getPlayerNameByID(gameMetadata, playerId)}</div>
      <div className="playerTalks">
        {currentPhaseIsTalk && (!currentPlayerIsTopPlayer || G.__isWaitingBeforeMovingToNextPhase) && G.playersSaid[playerId] && (
          <PlayerSaidComponent playerSaid={G.playersSaid[playerId]}/>
        )}
        {/* {currentPhaseIsPlayCards && !isNotFirstPlayCardTurn && topPlayerSaidAnnounces.length > 0 && (
          <PlayerSaidAnnounceGroupsComponent saidAnnounceGroups={topPlayerSaidAnnounces.map(a => a.announceGroup!)}/>
        )} */}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <Row>
        <Col span={6}>
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
        </Col>
        <Col span={10} offset={1}>
          {playerArea(topPlayerID, partnerTeamID, 'top', true)}
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          {playerArea(leftPlayerID, opponentTeamID, 'left', true)}
        </Col>
        <Col span={10}>
          {!currentPhaseIsDisplayResults && (<PlayedCardsComponent bottomPlayerID={bottomPlayerID} playedCards={playedCards} trumpMode={G.currentSayTake?.trumpMode} />)}
          {currentPhaseIsDisplayResults && (
            <CardContainer
              title="Score final"
              actions={[
                !G.resultsConfirmations[bottomPlayerID] && (<Button onClick={() => {
                  if(!G.resultsConfirmations[bottomPlayerID])
                    moves.confirmResults(bottomPlayerID);
                }
                }>Ok</Button>),
              ]}
            >
              <RoundScore partnerTeamID={partnerTeamID} opponentTeamID={opponentTeamID} roundScore={G.roundResults}
                currentSayTake={G.currentSayTake} />
            </CardContainer>
          )}
        </Col>
        <Col span={7}>
          {playerArea(rightPlayerID, opponentTeamID, 'right', false)}
        </Col>
      </Row>
      <Row>
        {!G.__isWaitingBeforeMovingToNextPhase && currentPhaseIsPlayCards && isNotFirstPlayCardTurn && (
          <PreviousCardsPlayedMenuComponent
            isDisplayedPreviousCardsPlayed={isDisplayedPreviousCardsPlayed}
            toggleIsDisplayedPreviousCardsPlayed={() => setIsDisplayedPreviousCardsPlayed(!isDisplayedPreviousCardsPlayed)}
          />
        )}
      </Row>
      <TalkMenuComponent
        saySkip={saySkip}
        canSayTake={!(G.currentSayTake && G.currentSayTake.sayContreLevel === 'contre')}
        sayTake={sayTake}
        sayContre={sayContre}
        visible={!G.__isWaitingBeforeMovingToNextPhase && !isDisplayedPreviousCardsPlayed && currentPhaseIsTalk && currentPlayerIsBottomPlayer}
        canSayContre={Boolean(G.currentSayTake && G.attackingTeam === opponentTeamID && G.currentSayTake.sayContreLevel !== 'contre')}
        canSaySurcontre={Boolean(G.currentSayTake && G.attackingTeam === partnerTeamID && G.currentSayTake.sayContreLevel === 'contre')}
        selectedTrumpModeDefaultValue={lastBottomPlayerTakeSaid ? lastBottomPlayerTakeSaid.trumpMode : undefined}
        sayableExpectedPoints={validExpectedPoints.filter(expectedPoint => isSayableExpectedPoints(expectedPoint, G.currentSayTake?.expectedPoints))}
      />
      <Affix offsetBottom={0} style={{zIndex:1005}}>
        <Row>
          <Col offset={5} span={15}>
            <div className={`myPlayer player bottom ${getTurnIndicatorClassForPosition('bottom', currentPhaseNeedsToWaitForAPlayerMove, currentPlayerIsTopPlayer, currentPlayerIsLeftPlayer, currentPlayerIsRightPlayer, currentPlayerIsBottomPlayer)}`}>
              <div className="playerTalks">
                {currentPhaseIsTalk && (!currentPlayerIsBottomPlayer || G.__isWaitingBeforeMovingToNextPhase) && G.playersSaid[bottomPlayerID] && (
                  <PlayerSaidComponent playerSaid={G.playersSaid[bottomPlayerID]}/>
                )}
                {/* {currentPhaseIsPlayCards && !isNotFirstPlayCardTurn && bottomPlayerSaidAnnounces.length > 0 && (
                  <PlayerSaidAnnounceGroupsComponent saidAnnounceGroups={bottomPlayerSaidAnnounces.map(a => a.announceGroup!)}/>
                )} */}
              </div>
              <div className="currentPlayerIndicator" />
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
      </Affix>
    </React.Fragment>
  );
};
