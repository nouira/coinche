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
import { Radio, Button, Row, Col, Space, Typography, Modal } from 'antd';
import { SuitComponent } from './Card';
import { RadioChangeEvent } from 'antd/lib/radio';
const { Text } = Typography;

type ComponentProps = {
  saySkip: () => void,
  canSayTake: boolean,
  sayTake: (selectedExpectedPoints: ExpectedPoints, selectedTrumpMode: TrumpMode) => void,
  canSayContre: boolean,
  canSaySurcontre: boolean,
  sayContre: () => void,
  selectedTrumpModeDefaultValue: TrumpMode | undefined,
  sayableExpectedPoints: ExpectedPoints[],
  visible: boolean,
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
  visible,
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

  console.log(selectedExpectedPoint);
  console.log(sayableExpectedPoints);

  const radioButtonStyle = { padding: '4px 10px 0 10px' };

  return (
    <React.Fragment>
      <Modal className="talkMenu"
        visible={visible}
        closable={false}
        centered
        footer={[
          <Button onClick={() => sayContre()} disabled={(!canSayContre && !canSaySurcontre)}>
            {canSaySurcontre ? i18n.TalkMenu.surcontreButton : i18n.TalkMenu.contreButton}
          </Button>,
          <Button type="primary" onClick={() => saySkip()}>
            {i18n.TalkMenu.skipButton}
          </Button>,
        ]}
      >
        {canSayTake && sayableExpectedPoints.length > 0 && (
          <React.Fragment>
            <Row className="contractPoints" align="middle" justify="center" style={{height:'100px'}}>
              <Col span={8} offset={2}>
                <Space size={0}>
                  <Button className="buttonMinus" type="primary" onClick={() => {
                    if (selectedExpectedPoint === undefined) {
                      setSelectedExpectedPoint(sayableExpectedPoints[0]);
                    }
                    else
                    {
                      var index = sayableExpectedPoints.indexOf(selectedExpectedPoint);
                      var next = sayableExpectedPoints[index - 1];
                      setSelectedExpectedPoint(next);
                    }
                  }}
                  disabled={selectedExpectedPoint !== undefined && sayableExpectedPoints.indexOf(selectedExpectedPoint) === 0}>
                  -
                  </Button>
                  <div className="selectedExpectedPoint">
                    <Text>{selectedExpectedPoint === Capot ? i18n.Score.capot : selectedExpectedPoint}</Text>
                  </div>
                  <Button className="buttonPlus" type="primary" onClick={() => {
                    if (selectedExpectedPoint === undefined) {
                      setSelectedExpectedPoint(sayableExpectedPoints[0]);
                    }
                    else
                    {
                      var index = sayableExpectedPoints.indexOf(selectedExpectedPoint);
                      var next = sayableExpectedPoints[index + 1];
                      setSelectedExpectedPoint(next);
                    }
                  }}
                  disabled={selectedExpectedPoint !== undefined && sayableExpectedPoints.indexOf(selectedExpectedPoint) === sayableExpectedPoints.length - 1}>
                  +
                  </Button>
                </Space>
              </Col>
              <Col span={9}>
                <Radio.Group onChange={onChangeTrumpMode} defaultValue={selectedTrumpMode} buttonStyle="solid">
                  {validTrumpModes.map(trumpMode => (
                    <Radio.Button value={trumpMode} key={`trumpMode_${trumpMode}`} style={radioButtonStyle}>
                      <SuitComponent cardColor={getCardColorAssociatedToTrumpMode(trumpMode)} />
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Col>
            </Row>
            <Row align="middle" justify="center">
              <Col span={3}>
                <Button disabled={!selectedTrumpMode}
                  onClick={(selectedExpectedPoint && selectedTrumpMode) ? () => sayTake(selectedExpectedPoint, selectedTrumpMode) : undefined}
                  data-testid="button sayTake">{i18n.TalkMenu.takeButton}</Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Modal>
    </React.Fragment>
  );
};
