import {BoardProps} from 'boardgame.io/react';
import {GameStatePlayerView, Moves, PhaseID, PlayerID} from '../../shared/coinche';

export const getPlayerNameByID = (gameMetadata: BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>['gameMetadata'], ID: PlayerID): string => {
  const playerMetadata = gameMetadata?.find(m => (String(m.id) as PlayerID) === ID);
  if (!playerMetadata) {
    console.log(`No game metadata for player [${ID}]`);
    return ID;
  }

  return playerMetadata.name;
  // return ID;
};
