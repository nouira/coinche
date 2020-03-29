import React, {useContext, useState} from 'react';
import {BoardProps} from 'boardgame.io/react';
import {
  ExpectedPoints,
  GameStatePlayerView,
  isSayableExpectedPoints,
  Moves,
  PhaseID,
  PlayerID,
  TrumpMode,
  validExpectedPoints,
  validTrumpModes,
} from '../../shared/coinche';
import {I18nContext} from '../context/i18n';

type ComponentProps = {
  saySkip: () => void,
  sayTake: (selectedExpectedPoints: ExpectedPoints, selectedTrumpMode: TrumpMode) => void,
  sayCoinche: () => void,
  displaySayCoincheButton: boolean,
  displaySaySurcoincheButton: boolean,
  selectedTrumpModeDefaultValue: TrumpMode | undefined,
  // @TODO: stop to rely directly on playersSaid
  playersSaid: BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>['G']['playersSaid'],
};
export const TalkMenuComponent: React.FunctionComponent<ComponentProps> = ({
  saySkip,
  sayTake,
  sayCoinche,
  displaySayCoincheButton,
  displaySaySurcoincheButton,
  selectedTrumpModeDefaultValue,
  playersSaid,
}) => {
  const i18n = useContext(I18nContext);
  const [selectedTrumpMode, setSelectedTrumpMode] = useState(selectedTrumpModeDefaultValue);
  const [selectedExpectedPoint, setSelectedExpectedPoint] = useState(validExpectedPoints[0]);

  const onChangeTrumpMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrumpMode = event.target.value as TrumpMode;
    if (validTrumpModes.includes(newTrumpMode)) {
      setSelectedTrumpMode(newTrumpMode);
    } else {
      setSelectedTrumpMode(undefined);
    }
  };
  const onChangeExpectedPoint = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newExpectedPoint = parseInt(event.target.value, 10) as ExpectedPoints;
    if (validExpectedPoints.includes(newExpectedPoint)) {
      setSelectedExpectedPoint(newExpectedPoint);
    }
  };

  const sayableExpectedPoints = validExpectedPoints.filter(expectedPoint => isSayableExpectedPoints(expectedPoint, playersSaid));
  // Force selectedExpectedPoint to be at least the minimum sayable expectedPoints when playersSaid changes
  if (sayableExpectedPoints.length && sayableExpectedPoints[0] > selectedExpectedPoint) {
    setSelectedExpectedPoint(sayableExpectedPoints[0]);
  }

  return (
    <div className="talk">
      <select value={selectedExpectedPoint} onChange={onChangeExpectedPoint} data-testid="select sayTakeExpectedPoint">
        {sayableExpectedPoints.map(expectedPoint => (
          <option value={expectedPoint} key={`expectedPoint_${expectedPoint}`}>
            {expectedPoint}
          </option>
        ))}
      </select>
      <select value={selectedTrumpMode} onChange={onChangeTrumpMode} data-testid="select sayTakeTrumpMode">
        <option value="">{i18n.TalkMenu.selectTrumpModeDefaultMessage}</option>
        {validTrumpModes.map(trumpMode => (
          <option value={trumpMode} key={`trumpMode_${trumpMode}`}>
            {i18n.trumpMode[trumpMode]}
          </option>
        ))}
      </select>
      <button disabled={!selectedTrumpMode} onClick={selectedTrumpMode ? () => sayTake(selectedExpectedPoint, selectedTrumpMode) : undefined} data-testid="button sayTake">{i18n.TalkMenu.takeButton}</button>
      {(displaySayCoincheButton || displaySaySurcoincheButton) && (
        <button className="sayCoincheButton" onClick={() => sayCoinche()} data-testid="button sayCoinche">{displaySaySurcoincheButton ? i18n.TalkMenu.surcoincheButton : i18n.TalkMenu.coincheButton}</button>
      )}
      <button className="saySkipButton" onClick={() => saySkip()} data-testid="button saySkip">{i18n.TalkMenu.skipButton}</button>
    </div>
  );
};
