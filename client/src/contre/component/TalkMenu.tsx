import React, {useContext, useState} from 'react';
import {
  ExpectedPoints,
  TrumpMode,
  validExpectedPoints,
  validTrumpModes,
  getCardColorAssociatedToTrumpMode,
  Capot,
} from '../../shared/contre';
import {I18nContext} from '../context/i18n';
import { Radio, Button, Col } from 'antd';
import { SuitComponent } from './Card';
import { RadioChangeEvent } from 'antd/lib/radio';

type ComponentProps = {
  saySkip: () => void,
  canSayTake: boolean,
  sayTake: (selectedExpectedPoints: ExpectedPoints, selectedTrumpMode: TrumpMode) => void,
  canSayContre: boolean,
  canSaySurcontre: boolean,
  sayContre: () => void,
  selectedTrumpModeDefaultValue: TrumpMode | undefined,
  sayableExpectedPoints: ExpectedPoints[],
};

export const TalkMenuComponent: React.FunctionComponent<ComponentProps> = ({
  saySkip,
  canSayTake,
  sayTake,
  sayContre,
  canSayContre,
  canSaySurcontre,
  selectedTrumpModeDefaultValue,
  sayableExpectedPoints,
}) => {
  const i18n = useContext(I18nContext);
  const [selectedTrumpMode, setSelectedTrumpMode] = useState(selectedTrumpModeDefaultValue);
  const [selectedExpectedPoint, setSelectedExpectedPoint] = useState(sayableExpectedPoints.length ? sayableExpectedPoints[0] : undefined);

  const onChangeTrumpMode = (event: RadioChangeEvent) => {
    const newTrumpMode = event.target.value as TrumpMode;
    if (validTrumpModes.includes(newTrumpMode)) {
      setSelectedTrumpMode(newTrumpMode);
    } else {
      setSelectedTrumpMode(undefined);
    }
  };
  const onChangeExpectedPoint = (event: RadioChangeEvent) => {
    const newExpectedPoint = parseInt(event.target.value, 10) as ExpectedPoints;
    if (validExpectedPoints.includes(newExpectedPoint)) {
      setSelectedExpectedPoint(newExpectedPoint);
    }
  };

  const radioButtonStyle = { padding: '4px 10px 0 10px' };

  return (
    <React.Fragment>
      {canSayTake && sayableExpectedPoints.length > 0 && (
        <React.Fragment>
          <Col span={10}>
            <Radio.Group onChange={onChangeExpectedPoint} defaultValue={selectedExpectedPoint} buttonStyle="solid">
              {sayableExpectedPoints.map(expectedPoint => (
                <Radio.Button value={expectedPoint} key={`expectedPoint_${expectedPoint}`} style={{padding: '0px 10px'}}>
                  {expectedPoint == Capot ? i18n.Score.capot : expectedPoint}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Col>
          <Col span={5}>
            <Radio.Group onChange={onChangeTrumpMode} defaultValue={selectedTrumpMode} buttonStyle="solid">
              {validTrumpModes.map(trumpMode => (
                <Radio.Button value={trumpMode} key={`trumpMode_${trumpMode}`} style={radioButtonStyle}>
                  <SuitComponent cardColor={getCardColorAssociatedToTrumpMode(trumpMode)} />
                </Radio.Button>
              ))}
            </Radio.Group>
          </Col>
          <Col span={3}>
            <Button disabled={!selectedTrumpMode}
              onClick={(selectedExpectedPoint && selectedTrumpMode) ? () => sayTake(selectedExpectedPoint, selectedTrumpMode) : undefined}
              data-testid="button sayTake">{i18n.TalkMenu.takeButton}</Button>
          </Col>
        </React.Fragment>
      )}
      {(canSayContre || canSaySurcontre) && (
        <Col span={3}>
          <Button danger onClick={() => sayContre()} data-testid="button sayContre">{canSaySurcontre ? i18n.TalkMenu.surcontreButton : i18n.TalkMenu.contreButton}</Button>
        </Col>
      )}
      <Col span={3}>
        <Button type="primary" onClick={() => saySkip()} data-testid="button saySkip">{i18n.TalkMenu.skipButton}</Button>
      </Col>
    </React.Fragment>
  );
};
